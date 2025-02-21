import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-vendor',
  imports: [],
  templateUrl: './add-edit-vendor.component.html',
  styleUrl: './add-edit-vendor.component.css'
})
export class AddEditVendorComponent {
  @ViewChild('addEditVendor') addEditVendor!: TemplateRef<any>;
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  what: String = "Add";

  ngOnInit() {
    this.modalService.openModalEvent.subscribe((modalType: ModalType) => {
      if (modalType === ModalType.VENDOR) {
        this.openModal();
      }
    });
    this.modalService.dataTransferObject.subscribe((dto: any) => {
      if (dto != null) {
        console.log(dto)
      }
    })
  }

  openModal() {
    if (this.addEditVendor) {
      this.ngbModalService.open(this.addEditVendor, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

}
