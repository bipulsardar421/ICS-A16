import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { AlertService } from '../../../data/services/alert.service';
import { LoginService } from '../../../data/services/login/login.service';

@Component({
  selector: 'app-reset-pwd',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-pwd.component.html',
  styleUrl: './reset-pwd.component.css'
})
export class ResetPwdComponent {

  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  changePasswordForm: FormGroup;

  @ViewChild('resetModal') resetModalContent!: TemplateRef<any>;

  constructor(private _loginService: LoginService, private alertService: AlertService) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      new_pwd: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  ngOnInit() {
    this.modalService.openModalEvent.subscribe((modalType: ModalType) => {
      if (modalType === ModalType.RESETPWD) {
        this.openModal();
      }
    });
  }
  onChangePassword() {
    this.alertService.showLoading();
        this._loginService.changePwd(FormDataConverter.toFormData(this.changePasswordForm)).subscribe({
          next: (response) => {
            this.alertService.hideLoading();
            console.log('response from api', response);
            if (response.status !== 'error') {
              this.alertService.showAlert('success', response.message);
              this.ngbModalService.dismissAll();
            } else {
              this.alertService.showAlert('danger', response.message);
            }
          },
          error: (error) => {
            console.error('Signup failed', error);
          },
        });
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('newPassword')!.value === group.get('new_pwd')!.value
      ? null : { passwordMismatch: true };
  }

  openModal() {
    if (this.resetModalContent) {
      this.ngbModalService.open(this.resetModalContent, { ariaLabelledBy: 'modal-basic-title' });
    }
  }
}
