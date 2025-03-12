import { Component, inject, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SignUpService } from '../../../data/services/sign-up/sign-up.service';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { AlertService } from '../../../data/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  
  signUpForm!: FormGroup;
  private modalSubscription!: Subscription;

  @ViewChild('signupModal') signupModalContent?: TemplateRef<any>;

  constructor(
    private _signupService: SignUpService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.modalSubscription = this.modalService.openModalEvent.subscribe(
      (modalType: ModalType) => {
        if (modalType === ModalType.SIGNUP) {
          this.openModal();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  onSignUp() {
    if (this.signUpForm.invalid) {
      console.warn('Form is invalid');
      return;
    }
    
    const formData = FormDataConverter.toFormData(this.signUpForm);
    this.alertService.showLoading();

    this._signupService.registerUser(formData).subscribe({
      next: (response) => {
        this.alertService.hideLoading();

        if (response.status !== 'error') {
          this.alertService.showAlert('success', response.message);
          this.getOtp();
        } else {
          this.alertService.showAlert('danger', response.message);
        }
      },
      error: (error) => {
        console.error('Signup failed', error);
        this.alertService.hideLoading();
        this.alertService.showAlert('danger', 'Server Unavailable!');
      },
    });
  }

  getOtp() {
    if (!this.signUpForm?.controls['email']) {
      console.error('Signup form is not initialized properly.');
      return;
    }

    this.modalService.dataTransferer({
      type: 'sign-up',
      email: this.signUpForm.controls['email'].value,
    });
    this.closeModal();
    this.modalService.triggerOpenModal(ModalType.OTP);
  }

  openModal() {
    if (!this.signupModalContent) {
      console.warn('Signup modal content is not available yet.');
      return;
    }
    this.ngbModalService.open(this.signupModalContent, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  closeModal() {
    if (this.ngbModalService.hasOpenModals()) {
      this.ngbModalService.dismissAll();
    }
  }
}
