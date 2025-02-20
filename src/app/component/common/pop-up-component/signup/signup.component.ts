import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  signUpForm: FormGroup;

  @ViewChild('signupModal') signupModalContent!: TemplateRef<any>;
  constructor() {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  ngOnInit() {
    this.modalService.openModalEvent.subscribe((modalType: ModalType) => {
      if (modalType === ModalType.SIGNUP) {
        this.openModal();
      }
    });
  }
  onSignUp() {
    console.log(this.signUpForm.value);

  }
  openModal() {
    if (this.signupModalContent) {
      this.ngbModalService.open(this.signupModalContent, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

}
