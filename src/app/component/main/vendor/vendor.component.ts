import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ModalService, ModalType } from '../../data/services/modal.service';
import { UserService } from '../../data/services/user-details/user.service';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientVendorService } from '../../data/services/client-vendor/client-vendor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [CommonModule, NgbPopoverModule],
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
})
export class VendorComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private _vendor = inject(ClientVendorService);
  vendors: any[] = [];
  private dataChangeSubscription!: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchVendors();
    this.dataChangeSubscription = this._vendor.dataChanged$.subscribe((entityType) => {
      if (entityType === 'vendor') {
        console.log('Vendor data changed, refreshing table');
        this.fetchVendors();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataChangeSubscription) {
      this.dataChangeSubscription.unsubscribe();
    }
  }

  fetchVendors(): void {
    this._vendor.getAllVendors().subscribe(
      (response: { status: string; data: any[]; message: any }) => {
        if (response.status === 'Success') {
          this.vendors = response.data;
        } else {
          console.error('Error fetching vendors:', response.message);
          this.vendors = [];
        }
      },
      (error: any) => {
        console.error('HTTP error fetching vendors:', error);
        this.vendors = [];
      }
    );
  }

  addVendor() {
    console.log('Adding new vendor');
    this.modalService.dataTransferer({ type: 'Add' });
    this.openModel();
  }

  openModel() {
    this.modalService.triggerOpenModal(ModalType.REALVENDOR);
  }

  manageVendor(vendorId: number) {
    console.log('Managing vendor with ID:', vendorId);
    this.modalService.dataTransferer({ type: 'Edit', id: vendorId });
    this.openModel();
  }

  deleteVendor(vendorId: number) {
    const form = new FormData();
    form.append('vendor_id', vendorId.toString());
    this._vendor.deleteVendor(form).subscribe(
      (response: { status: string; message: any }) => {
        if (response.status === 'Success') {
          this.vendors = this.vendors.filter((vendor) => vendor.vendor_id !== vendorId);
          this._vendor.notifyDataChange('vendor'); 
          console.log('Vendor deleted successfully');
        } else {
          console.error('Error deleting vendor:', response.message);
        }
      },
      (error: any) => {
        console.error('HTTP error deleting vendor:', error);
      }
    );
  }
}