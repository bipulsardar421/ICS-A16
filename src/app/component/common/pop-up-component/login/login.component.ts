import {
  Component,
  TemplateRef,
  inject,
  OnInit,
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
import { UsersInterface } from '../../../data/interfaces/users.interface';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { AlertService } from '../../../data/services/alert.service';
import { LoginService } from '../../../data/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  loginForm: FormGroup;

  @ViewChild('loginModal') loginModalContent?: TemplateRef<any>;

  constructor(
    private alertService: AlertService,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.modalService.openModalEvent.subscribe((modalType: ModalType) => {
      if (modalType === ModalType.LOGIN) {
        this.openModal();
      }
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      console.warn('Form is invalid');
      return;
    }
    this.loginForm.addControl('operation', new FormControl('login'));
    const formData = FormDataConverter.toFormData(this.loginForm);
    this.alertService.showLoading();
    this.loginService.login(formData).subscribe({
      next: (response) => {
        this.alertService.hideLoading();
        console.log('response from api', response);
        if (response.status !== 'error') {
          this.alertService.showAlert('success', response.message);
          this.getOtp();
        } else {
          this.alertService.showAlert('danger', response.message);
        }
      },
      error: (error) => {
        console.error('Signup failed', error);
      },
    });
  }

  getOtp() {
    this.closeModal();
    this.modalService.dataTransferer({
      type: 'login',
      email: this.loginForm.controls['username'].value,
    });
    this.modalService.triggerOpenModal(ModalType.OTP);
  }

  openModal() {
    if (this.loginModalContent) {
      this.ngbModalService.open(this.loginModalContent, {
        ariaLabelledBy: 'modal-basic-title',
      });
    }
  }
  closeModal() {
    if (this.loginModalContent) {
      this.ngbModalService.dismissAll();
    }
  }
  openForgotPwdModal() {
    this.modalService.triggerOpenModal(ModalType.FORGOTPWD);
  }
}
