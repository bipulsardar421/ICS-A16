// edit-user-details.component.ts
import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../data/services/user-details/user.service';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsersInterface } from '../../../data/interfaces/users.interface';

@Component({
  selector: 'app-edit-user-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-user-details.component.html',
  styleUrls: ['./edit-user-details.component.css'],
})
export class EditUserDetailsComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  editForm!: FormGroup;
  private modalSubscription!: Subscription;
  userId: number | null = null;
  userData: UsersInterface | null = null;
  dbId: number | null = null;
  previewUrl: string | null = null; // Add preview URL property

  @ViewChild('editModal') editModalContent?: TemplateRef<any>;

  ngOnInit() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: [''],
      image: [null],
      status: ['active', Validators.required],
    });

    this.modalSubscription = this.modalService.openModalEvent.subscribe(
      (modalType: ModalType) => {
        if (modalType === ModalType.EDITUSER) {
          const data = this.modalService.getCurrentData();
          if (data?.type === 'edit' && data?.data) {
            this.userData = data.data as UsersInterface;
            this.userId = this.userData.user_id;
            this.loadUserData();
          }
          this.openModal();
          this.modalService.clearCurrentData();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
    // Clean up preview URL to prevent memory leaks
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }

  isImageString(): boolean {
    const imageValue = this.editForm.get('image')?.value;
    return imageValue && !(imageValue instanceof File);
  }

  loadUserData() {
    if (!this.userId) return;

    const formData = new FormData();
    formData.append('id', this.userId.toString());
    this.userService.getDetailsWithId(formData).subscribe({
      next: (response) => {
        if (response.length > 0) {
          const user = response[0];
          this.dbId = user.id;
          this.editForm.patchValue({
            name: user.user_name,
            phone: user.phone,
            address: user.address,
            image: user.image,
            status: user.status,
          });
          this.previewUrl = null; // Reset preview when loading existing data
        }
      },
      error: (error) => console.error('Error loading user data:', error),
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.editForm.patchValue({ image: file });
      // Generate preview URL
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl); // Clean up previous preview
      }
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  onSubmit() {
    if (this.editForm.invalid) {
      console.warn('Form is invalid');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.dbId!.toString());
    formData.append('user_id', this.userId!.toString());
    formData.append('name', this.editForm.get('name')!.value);
    formData.append('phone', this.editForm.get('phone')!.value);
    formData.append('address', this.editForm.get('address')!.value || '');
    formData.append('status', this.editForm.get('status')!.value);
    const imageValue = this.editForm.get('image')!.value;
    if (imageValue instanceof File) {
      formData.append('image', imageValue);
    } else if (imageValue) {
      formData.append('image', imageValue);
    }

    this.userService.editDetails(formData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          console.log('User updated successfully');
          const updatedUser: UsersInterface = {
            id: this.dbId!,
            user_id: this.userId!,
            user_name: this.editForm.get('name')!.value,
            phone: this.editForm.get('phone')!.value,
            address: this.editForm.get('address')!.value || '',
            image: imageValue instanceof File ? '' : imageValue,
          };
          this.userService.notifyUserUpdated(updatedUser);
          this.closeModal();
          if (imageValue instanceof File) {
            this.loadUserDataAfterUpdate();
          }
        } else {
          console.error('Update failed:', response.message);
        }
      },
      error: (error) => console.error('Error updating user:', error),
    });
  }

  private loadUserDataAfterUpdate() {
    const formData = new FormData();
    formData.append('id', this.userId!.toString());
    this.userService.getDetailsWithId(formData).subscribe({
      next: (response) => {
        if (response.length > 0) {
          const updatedUser = response[0];
          this.userService.notifyUserUpdated(updatedUser);
          this.previewUrl = null; // Reset preview after successful upload
        }
      },
      error: (error) => console.error('Error fetching updated user:', error),
    });
  }

  openModal() {
    if (!this.editModalContent) {
      console.warn('Edit modal content is not available yet.');
      return;
    }
    const modalRef = this.ngbModalService.open(this.editModalContent, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: true,
    });
    modalRef.result.then(
      (result) => {
        console.log(`Modal closed with: ${result}`);
        this.resetForm();
      },
      (reason) => {
        console.log(`Modal dismissed: ${this.getDismissReason(reason)}`);
        this.resetForm();
      }
    );
  }

  closeModal() {
    if (this.ngbModalService.hasOpenModals()) {
      this.ngbModalService.dismissAll();
    }
  }

  private resetForm() {
    this.editForm.reset({ status: 'active' });
    this.editForm.markAsPristine();
    this.userId = null;
    this.userData = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
    if (reason === ModalDismissReasons.BACKDROP_CLICK)
      return 'by clicking on a backdrop';
    return `with: ${reason}`;
  }
}
