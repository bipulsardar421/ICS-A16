import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { UserService } from '../../../data/services/user-details/user.service';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { AlertService } from '../../../data/services/alert.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-details',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private router = inject(Router);
  invalidImageFormat = false;
  userForm: FormGroup;
  usernameTaken = false;
  phoneTaken = false;
  imagePreview: string | ArrayBuffer | null = null;

  selectedFile: File | null = null;
  @ViewChild('user_details') user_detailsModalContent!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private _user: UserService,
    private alertService: AlertService
  ) {
    this.userForm = this.fb.group({
      user_id: [{ value: localStorage.getItem('user_id'), disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]],
      image: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.modalService.openModalEvent.subscribe((modalType: ModalType) => {
      if (modalType === ModalType.USER) {
        this.openModal();
      }
    });
    this.modalService.dataTransferObject.subscribe((data: any) => {
      if (data != null) {
        this.userForm.controls['user_id'].patchValue(data);
      }
    });
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        this.invalidImageFormat = true;
        this.userForm.get('image')?.setErrors({ invalidFormat: true });
      } else {
        this.invalidImageFormat = false;
        this.selectedFile = file;
        this.userForm.patchValue({ image: this.selectedFile });
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.userForm.patchValue({ image: file });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      alert('Please fill all fields correctly.');
      return;
    }
    const formData = FormDataConverter.toFormData(this.userForm);
    this.alertService.showLoading();
    this._user.addDetails(formData).subscribe({
      next: (response) => {
        this.alertService.hideLoading();

        if (response.status !== 'error') {
          this.alertService.showAlert('success', response.message);
          setTimeout(() => {
            this.closeModal();
            window.location.reload();
            this.router.navigate(['/main']);
          }, 1000);
        } else {
          this.alertService.showAlert('danger', response.message);
        }
      },
      error: (error) => {
        console.error('Signup failed', error);
      },
    });
  }
  checkUserNameAvailability() {
    const username = this.userForm.get('user_name')?.value;
    if (username.length > 0) {
      const name = new FormData();
      name.append('name', username);
      this._user.checkUserName(name).subscribe((response: any[]) => {
        this.usernameTaken = response.length > 0;
      });
    }
  }
  checkPhoneAvailability() {
    const username = this.userForm.get('phone')?.value;
    if (username.length > 0) {
      const name = new FormData();
      name.append('name', username);
      this._user.checkPhone(name).subscribe((response: any[]) => {
        this.phoneTaken = response.length > 0;
      });
    }
  }
  openModal() {
    if (this.user_detailsModalContent) {
      this.ngbModalService.open(this.user_detailsModalContent, {
        ariaLabelledBy: 'modal-basic-title',
      });
    }
  }
  closeModal() {
    if (this.user_detailsModalContent) {
      this.ngbModalService.dismissAll();
    }
  }
}
