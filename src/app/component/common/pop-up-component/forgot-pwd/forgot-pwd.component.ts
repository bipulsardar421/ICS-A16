import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]]
    });
    this.otpSubmitForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
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
    console.log(this.forgotPasswordForm.value)
    this.otpSuccess = true
  }
  submitOtp() {
    console.log(this.otpSubmitForm.value)
    this.openResetPwdModal()
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
