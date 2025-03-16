import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ModalService, ModalType } from '../../data/services/modal.service';
import { AddEditVendorComponent } from '../../common/pop-up-component/add-edit-vendor/add-edit-vendor.component';
import { UserService } from '../../data/services/user-details/user.service';
import { UsersInterface } from '../../data/interfaces/users.interface';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
})
export class VendorComponent implements OnInit {
  private modalService = inject(ModalService);
  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.getUserDetails();
  }
  vendors: UsersInterface[] = [];

  addVendor() {
    this.modalService.dataTransferer('Add');
    this.openModel();
  }
  editVendor(data: UsersInterface) {
    this.modalService.dataTransferer({
      type: 'edit',
      data,
    });
    this.openModel();
  }
  getUserDetails() {
    this.userService.getDetails().subscribe({
      next: (response) => {
        this.vendors = response;
        if (response.status !== 'error') {
        } else {
        }
      },
      error: (error) => {
        console.error('Signup failed', error);
      },
    });
  }
  openModel() {
    this.modalService.triggerOpenModal(ModalType.VENDOR);
  }

  deleteVendor(index: number) {
    this.vendors.splice(index, 1);
  }
}
