import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { SignUpService } from '../../../data/services/sign-up/sign-up.service';
import { AlertService } from '../../../data/services/alert.service';
import { LoginService } from '../../../data/services/login/login.service';
import { AuthService } from '../../../data/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
})
export class OtpComponent {
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private router = inject(Router);

  private fb = inject(FormBuilder);
  otpForm: FormGroup;
  otpFor: any;
  @ViewChild('otpModal') otpModalContent!: TemplateRef<any>;

  constructor(
    private _signupService: SignUpService,
    private _loginService: LoginService,
    private alertService: AlertService
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit() {
    this.modalService.openModalEvent.subscribe((modalType: ModalType) => {
      if (modalType === ModalType.OTP) {
        this.openModal();
      }
    });
    this.modalService.dataTransferObject.subscribe((data: any) => {
      this.otpFor = data;
    });
  }
  onSubmitOtp() {
    if (this.otpFor.type === 'sign-up') {
      this.otpForm.addControl('email', new FormControl(this.otpFor.email));
      const formData = FormDataConverter.toFormData(this.otpForm);
      this.alertService.showLoading();
      this._signupService.matchOtp(formData).subscribe({
        next: (response) => {
          this.alertService.hideLoading();
          if (response.status !== 'error') {
            this.alertService.showAlert('success', 'Please Continue to Login.');
            setTimeout(() => {
              this.ngbModalService.dismissAll();
              this.modalService.triggerOpenModal(ModalType.LOGIN);
            }, 1000);
          } else {
            this.alertService.showAlert('danger', response.message);
          }
        },
        error: (error) => {
          this.alertService.hideLoading();
          this.alertService.showAlert(
            'danger',
            'Server not available, Please try again later.'
          );
        },
      });
    } else if (this.otpFor.type === 'login') {
      this.otpForm.addControl('operation', new FormControl(this.otpFor.type));
      this.otpForm.addControl('username', new FormControl(this.otpFor.email));
      const formData = FormDataConverter.toFormData(this.otpForm);
      this.alertService.showLoading();
      this._loginService.matchOtp(formData).subscribe({
        next: (response) => {
          if (response.status !== 'error') {
            this.alertService.showAlert('success', 'Please Continue to Login.');
            setTimeout(() => {
              this.alertService.hideLoading();
              this.ngbModalService.dismissAll();
              this.router.navigate(['/main/home']);
            }, 1000);
          } else {
            this.alertService.showAlert('danger', response.message);
          }
        },
        error: (error) => {
          this.alertService.hideLoading();
          this.alertService.showAlert(
            'danger',
            'Server not available, Please try again later.'
          );
        },
      });
    } else if (this.otpFor.type === 'forget-pwd') {
      this.otpForm.addControl('operation', new FormControl(this.otpFor.type));
    }
  }
  openModal() {
    if (this.otpModalContent) {
      this.ngbModalService.open(this.otpModalContent, {
        ariaLabelledBy: 'modal-basic-title',
      });
    }
  }
}
