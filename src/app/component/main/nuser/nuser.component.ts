import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ModalService, ModalType } from '../../data/services/modal.service';
import { UserService } from '../../data/services/user-details/user.service';
import { CommonModule } from '@angular/common';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersInterface } from '../../data/interfaces/users.interface';
import { Subscription } from 'rxjs';
import { EditUserDetailsComponent } from '../../common/pop-up-component/edit-user-details/edit-user-details.component';

@Component({
  selector: 'app-nuser',
  standalone: true,
  imports: [CommonModule, NgbPopoverModule, EditUserDetailsComponent],
  templateUrl: './nuser.component.html',
  styleUrls: ['./nuser.component.css'],
})
export class NuserComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private userService = inject(UserService);
  users: UsersInterface[] = [];
  private userUpdateSubscription!: Subscription;

  ngOnInit(): void {
    this.getUserDetails();
    this.userUpdateSubscription = this.userService.userUpdated$.subscribe(
      (updatedUser: UsersInterface) => {
        const index = this.users.findIndex(
          (user) => user.user_id === updatedUser.user_id
        );
        if (index !== -1) {
          this.users[index] = { ...updatedUser }; // Update existing user
        }
        console.log('User updated in DOM:', updatedUser);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userUpdateSubscription) {
      this.userUpdateSubscription.unsubscribe();
    }
  }

  addUser() {
    this.modalService.dataTransferer('Add');
    this.openModal();
  }

  editUser(data: UsersInterface) {
    this.modalService.dataTransferer({ type: 'edit', data });
    this.modalService.triggerOpenModal(ModalType.EDITUSER);
  }

  getUserDetails() {
    this.userService.getDetails().subscribe({
      next: (response) => {
        this.users = response; // Assuming response is an array of UsersInterface
        console.log('Users fetched:', this.users);
      },
      error: (error) => console.error('Error fetching users:', error),
    });
  }

  openModal() {
    this.modalService.triggerOpenModal(ModalType.VENDOR); // Use EDITUSER
  }

  deleteUser(index: number) {
    const userId = this.users[index].user_id; // Use user_id
    const formData = new FormData();
    formData.append('id', userId.toString());
    this.userService.deleteDetails(formData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.users.splice(index, 1);
          console.log('User deleted');
        }
      },
      error: (error) => console.error('Error deleting user:', error),
    });
  }
}
