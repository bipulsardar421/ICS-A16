import { Component, inject, OnInit } from '@angular/core';
import { ModalService, ModalType } from '../../data/services/modal.service';
import { UserService } from '../../data/services/user-details/user.service';
import { CommonModule } from '@angular/common';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersInterface } from '../../data/interfaces/users.interface';

@Component({
  selector: 'app-client',
  imports: [CommonModule, NgbPopoverModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
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
    this.userService.getClientDetails().subscribe({
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
    this.modalService.triggerOpenModal(ModalType.USER);
  }

  deleteVendor(index: number) {
    this.vendors.splice(index, 1);
  }
}
