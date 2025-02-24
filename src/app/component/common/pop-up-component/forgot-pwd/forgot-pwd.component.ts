import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../data/services/login/login.service';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { AlertService } from '../../../data/services/alert.service';

@Component({
  selector: 'app-forgot-pwd',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-pwd.component.html',
  styleUrl: './forgot-pwd.component.css'
})
export class ForgotPwdComponent {
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  forgotPasswordForm: FormGroup;
  otpSubmitForm: FormGroup;

  otpSuccess: boolean = false;

  @ViewChild('forgotPwd') forgotPwdModalContent!: TemplateRef<any>;

  constructor(private _loginService: LoginService, private alertService: AlertService,
  ) {
    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      operation: ['forgot-password']
    });
    this.otpSubmitForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      operation: ['forgot-password']
    });
  }
  ngOnInit() {
    this.modalService.openModalEvent.subscribe((modalType: ModalType) => {
      if (modalType === ModalType.FORGOTPWD) {
        this.openModal();
      }
    });
  }

  onGenerateOtp() {
    this.alertService.showLoading();
    this._loginService.genOtp(FormDataConverter.toFormData(this.forgotPasswordForm)).subscribe({
      next: (response) => {
        this.alertService.hideLoading();
        console.log('response from api', response);
        if (response.status !== 'error') {
          this.alertService.showAlert('success', response.message);
          this.otpSubmitForm.addControl('username', new FormControl(this.forgotPasswordForm.controls['username'].value
          ))
          this.otpSuccess = true
        } else {
          this.alertService.showAlert('danger', response.message);
        }
      },
      error: (error) => {
        console.error('Signup failed', error);
      },
    });

  }
  submitOtp() {
    this.alertService.showLoading();
    this._loginService.matchOtp(FormDataConverter.toFormData(this.otpSubmitForm)).subscribe({
      next: (response) => {
        this.alertService.hideLoading();
        console.log('response from api', response);
        if (response.status !== 'error') {
          this.alertService.showAlert('success', response.message);
          this.ngbModalService.dismissAll();
          this.openResetPwdModal()
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
    if (this.forgotPwdModalContent) {
      this.ngbModalService.open(this.forgotPwdModalContent, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

  openResetPwdModal() {
    this.modalService.triggerOpenModal(ModalType.RESETPWD);
  }
}
