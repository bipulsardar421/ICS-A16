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

  userForm: FormGroup;
  selectedFile: File | null = null;
  @ViewChild('user_details') user_detailsModalContent!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private _user: UserService,
    private alertService: AlertService
  ) {
    this.userForm = this.fb.group({
      user_id: [{ value: localStorage.getItem('user_id'), disabled: true }],
      user_name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
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
      this.selectedFile = event.target.files[0];
      this.userForm.patchValue({ image: this.selectedFile });
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
