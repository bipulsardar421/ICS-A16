import { Component, TemplateRef, inject, OnInit, ViewChild } from '@angular/core';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  loginForm: FormGroup;

  @ViewChild('loginModal') loginModalContent!: TemplateRef<any>;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    console.log(this.loginForm.value)
  }


  openModal() {
    if (this.loginModalContent) {
      this.ngbModalService.open(this.loginModalContent, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

  openForgotPwdModal() {
    this.modalService.triggerOpenModal(ModalType.FORGOTPWD);
  }


}
