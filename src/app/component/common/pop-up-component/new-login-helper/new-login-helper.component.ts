import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { AlertService } from '../../../data/services/alert.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from '../../../data/services/login/login.service';
import { CommonModule } from '@angular/common';
import { FormDataConverter } from '../../../data/helper/formdata.helper';

@Component({
  selector: 'app-new-login-helper',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './new-login-helper.component.html',
  styleUrls: ['./new-login-helper.component.css'],
})
export class NewLoginHelperComponent implements OnInit {
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private loginService = inject(LoginService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  @ViewChild('new_login_helper') editModalContent?: TemplateRef<any>;
  passwordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor() {
    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.modalService.openModalEvent.subscribe((modalType: ModalType) => {
      if (modalType === ModalType.LOGINHELPER) {
        this.openModal();
        this.modalService.clearCurrentData();
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mustMatch: true };
  }

  openModal() {
    if (!this.editModalContent) {
      console.warn('Edit modal content is not available yet.');
      return;
    }
    const modalRef = this.ngbModalService.open(this.editModalContent, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.result.then(
      (result) => {
        console.log(`Modal closed with: ${result}`);
      },
      (reason) => {
        console.log(`Modal dismissed: ${this.getDismissReason(reason)}`);
      }
    );
  }

  closeModal() {
    if (this.ngbModalService.hasOpenModals()) {
      this.ngbModalService.dismissAll();
      this.passwordForm.reset();
    }
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const formData = FormDataConverter.toFormData(this.passwordForm);

    formData.delete('confirmPassword');
    formData.append('new_pwd', this.passwordForm.get('newPassword')?.value);

    this.loginService.resetPwd(formData).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.successMessage = 'Password updated successfully!';
          this.alertService.showAlert(
            'success',
            'Password updated successfully!'
          );
          setTimeout(() => this.closeModal(), 1500);
        } else {
          this.errorMessage = response.message || 'Failed to update password.';
          this.alertService.showAlert('danger', this.errorMessage);
        }
      },
      error: (err) => {
        this.errorMessage = 'Error updating password: ' + err.message;
        this.alertService.showAlert('danger', this.errorMessage);
      },
    });
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
