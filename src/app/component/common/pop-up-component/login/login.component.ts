import {
  Component,
  TemplateRef,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertService } from '../../../data/services/alert.service';
import { LoginService } from '../../../data/services/login/login.service';
import { Subscription } from 'rxjs';
import { FormDataConverter } from '../../../data/helper/formdata.helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  loginForm!: FormGroup;
  private modalSubscription!: Subscription;

  @ViewChild('loginModal') loginModalContent?: TemplateRef<any>;

  constructor(
    private alertService: AlertService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.modalSubscription = this.modalService.openModalEvent.subscribe(
      (modalType: ModalType) => {
        if (modalType === ModalType.LOGIN) {
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

  onLogin() {
    if (this.loginForm.invalid) {
      console.warn('Form is invalid');
      return;
    }

    if (!this.loginForm.contains('operation')) {
      this.loginForm.addControl('operation', new FormControl('login'));
    }

    const formData = FormDataConverter.toFormData(this.loginForm);
    this.alertService.showLoading();

    this.loginService.login(formData).subscribe({
      next: (response) => {
        this.alertService.hideLoading();
        if (response.status !== 'error') {
          this.alertService.showAlert('success', response.message);
          this.getOtp();
        } else {
          this.alertService.showAlert('danger', response.message);
        }
      },
      error: () => {
        this.alertService.hideLoading();
        this.alertService.showAlert('danger', 'Server Unavailable!');
      },
    });
  }

  getOtp() {
    if (!this.loginForm?.controls['username']) {
      console.error('Login form is not initialized properly');
      return;
    }

    this.modalService.dataTransferer({
      type: 'login',
      email: this.loginForm.controls['username'].value,
    });
    this.closeModal();
    this.modalService.triggerOpenModal(ModalType.OTP);
  }

  openModal() {
    if (!this.loginModalContent) {
      console.warn('loginModalContent is not available yet');
      return;
    }
    this.loginForm?.reset();
    this.ngbModalService.open(this.loginModalContent, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  closeModal() {
    this.loginForm?.reset();
    if (this.ngbModalService.hasOpenModals()) {
      this.ngbModalService.dismissAll();
    }
  }

  openForgotPwdModal() {
    this.modalService.triggerOpenModal(ModalType.FORGOTPWD);
  }
}
