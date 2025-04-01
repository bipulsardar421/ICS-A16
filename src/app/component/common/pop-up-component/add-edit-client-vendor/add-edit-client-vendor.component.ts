import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientVendorService } from '../../../data/services/client-vendor/client-vendor.service';
import { AlertService } from '../../../data/services/alert.service';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { Subscription } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-client-vendor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-client-vendor.component.html',
  styleUrls: ['./add-edit-client-vendor.component.css'],
})
export class AddEditClientVendorComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private _clientVendorService = inject(ClientVendorService);

  editForm!: FormGroup;
  private modalSubscription!: Subscription;
  entityType: 'client' | 'vendor' = 'client';
  isEditMode: boolean = false;
  entityId: number | null = null;

  @ViewChild('editModal') editModalContent?: TemplateRef<any>;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      contactPerson: [''],
      address: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });

    this.modalSubscription = this.modalService.openModalEvent.subscribe(
      (modalType: ModalType) => {
        if (
          modalType === ModalType.REALCLIENT ||
          modalType === ModalType.REALVENDOR
        ) {
          this.entityType =
            modalType === ModalType.REALCLIENT ? 'client' : 'vendor';
          const data = this.modalService.getCurrentData();

          this.isEditMode = data?.type === 'Edit';
          this.entityId = data?.id || null;
          if (this.isEditMode && this.entityId) {
            this.loadEntityData();
          }
          this.openModal();
          this.modalService.clearCurrentData();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  loadEntityData() {
    if (!this.entityId) {
      console.warn('No entity ID provided for loading data');
      return;
    }

    const form = new FormData();
    form.append(
      this.entityType === 'client' ? 'client_id' : 'vendor_id',
      this.entityId.toString()
    );
    const serviceMethod =
      this.entityType === 'client'
        ? this._clientVendorService.getClientById(form)
        : this._clientVendorService.getVendorById(form);

    serviceMethod.subscribe({
      next: (response: { status: string; data: string }) => {
        if (response.status === 'Success') {
          const data = JSON.parse(response.data);
          this.editForm.patchValue({
            name: data[this.entityType + '_name'],
            contactPerson: data.contact_person,
            address: data.address,
            phone: data.phone,
          });
        } else {
          this.alertService.showAlert('danger', 'Failed to load entity data');
        }
      },
      error: (error: any) => {
        console.error('Error loading entity:', error);
        this.alertService.showAlert('danger', 'Server Unavailable!');
      },
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      console.warn('Form is invalid');
      return;
    }

    const formData = new FormData();
    formData.append(
      this.entityType === 'client' ? 'client_name' : 'vendor_name',
      this.editForm.get('name')?.value
    );
    formData.append(
      'contact_person',
      this.editForm.get('contactPerson')?.value || ''
    );
    formData.append('address', this.editForm.get('address')?.value || '');
    formData.append('phone', this.editForm.get('phone')?.value);

    if (this.isEditMode && this.entityId) {
      formData.append(
        this.entityType === 'client' ? 'client_id' : 'vendor_id',
        this.entityId.toString()
      );
    }

    const serviceMethod = this.isEditMode
      ? this.entityType === 'client'
        ? this._clientVendorService.updateClient(formData)
        : this._clientVendorService.updateVendor(formData)
      : this.entityType === 'client'
      ? this._clientVendorService.addClient(formData)
      : this._clientVendorService.addVendor(formData);

    this.alertService.showLoading();
    serviceMethod.subscribe({
      next: (response: { status: string; message: any }) => {
        this.alertService.hideLoading();
        if (response.status === 'Success') {
          this.alertService.showAlert(
            'success',
            this.isEditMode ? 'Updated Successfully' : 'Added Successfully'
          );
          this._clientVendorService.notifyDataChange(this.entityType);
          this.closeModal();
        } else {
          this.alertService.showAlert('danger', response.message);
        }
      },
      error: (error: any) => {
        console.error('Operation failed', error);
        this.alertService.hideLoading();
        this.alertService.showAlert('danger', 'Server Unavailable!');
      },
    });
  }

  openModal() {
    if (!this.editModalContent) {
      console.warn('Edit modal content is not available yet.');
      return;
    }

    const modalRef = this.ngbModalService.open(this.editModalContent, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: true,
    });

    modalRef.result.then(
      (result) => {
        this.resetForm();
      },
      (reason) => {
        this.resetForm();
      }
    );
  }

  closeModal() {
    if (this.ngbModalService.hasOpenModals()) {
      this.ngbModalService.dismissAll();
    }
  }

  private resetForm() {
    this.editForm.reset();
    this.editForm.markAsPristine();
    this.entityId = null;
    this.isEditMode = false;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
