import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { UsersInterface } from '../../../data/interfaces/users.interface';

@Component({
  selector: 'app-add-edit-vendor',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-vendor.component.html',
  styleUrl: './add-edit-vendor.component.css',
})
export class AddEditVendorComponent {
  @ViewChild('addEditVendor') addEditVendor!: TemplateRef<any>;
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  what: String = 'Add';
  dto!: UsersInterface;
  userForm!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      address: ['', Validators.required],
      image: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      user_id: ['', Validators.required],
      user_name: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.modalService.openModalEvent.subscribe((modalType: ModalType) => {
      if (modalType === ModalType.VENDOR) {
        this.openModal();
      }
    });
    this.modalService.dataTransferObject.subscribe((dto: any) => {
      if (dto != null) {
        this.what = dto.type;
        if (dto.type === 'edit') {
          this.dto = dto.data;
        }
      }
    });
  }
  onSubmit() {}
  openModal() {
    if (this.addEditVendor) {
      this.ngbModalService.open(this.addEditVendor, {
        ariaLabelledBy: 'modal-basic-title',
      });
    }
  }
}
