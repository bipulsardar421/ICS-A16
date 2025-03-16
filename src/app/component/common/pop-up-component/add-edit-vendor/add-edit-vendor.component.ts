import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { UsersInterface } from '../../../data/interfaces/users.interface';
import { LoginService } from '../../../data/services/login/login.service';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { AlertService } from '../../../data/services/alert.service';

@Component({
  selector: 'app-add-edit-vendor',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
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
  users: any[] = [];
  initialState: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _login: LoginService,
    private _alert: AlertService
  ) {
    this.userForm = this.fb.group({
      users: this.fb.array([]),
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
    this.fetchUsers();
  }
  fetchUsers(): void {
    const fd = new FormData();
    this._alert.showLoading();
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fd.append('id', userId);
    } else {
      console.error('User ID not found in localStorage');
    }
    this._login.getUserDetails(fd).subscribe({
      next: (apiResponse) => {
        this._alert.hideLoading();
        this.users = this.processUsers(apiResponse);
        this.initializeForm();
        this.storeInitialState();
      },
      error: (err) => {
        this._alert.hideLoading();
        this._alert.showAlert(
          'danger',
          'Something Went Wrong, please try again!!'
        );
      },
    });
  }

  processUsers(usersArray: any[]): any[] {
    return usersArray.map((user) => ({
      id: user.id,
      name: user.user_name,
      email: user.username,
      isClient: user.role === 'client',
      isVendor: user.role === 'vendor',
      isAdmin: user.role === 'admin',
    }));
  }

  initializeForm(): void {
    const userControls = this.users.map((user: any) =>
      this.fb.group({
        id: [user.id],
        name: [user.name],
        email: [user.email],
        isClient: [user.isClient],
        isVendor: [user.isVendor],
        isAdmin: [user.isAdmin],
      })
    );

    this.userForm.setControl('users', this.fb.array(userControls));
  }

  toggleRole(userIndex: number, selectedRole: string) {
    const userFormGroup = (this.userForm.get('users') as FormArray).at(
      userIndex
    );

    userFormGroup.patchValue({
      isClient: selectedRole === 'client',
      isVendor: selectedRole === 'vendor',
      isAdmin: selectedRole === 'admin',
    });
  }

  storeInitialState(): void {
    this.initialState = JSON.parse(JSON.stringify(this.userForm.value.users));
  }

  submitRoles(): void {
    this._alert.showLoading();
    const updatedUsers = this.userForm.value.users
      .filter(
        (user: any, index: number) =>
          JSON.stringify(user) !== JSON.stringify(this.initialState[index])
      )
      .flatMap((user: any) => [
        user.isClient
          ? {
              role: 'client',
              user_name: user.name,
              id: user.id,
              username: user.email,
            }
          : null,
        user.isVendor
          ? {
              role: 'vendor',
              user_name: user.name,
              id: user.id,
              username: user.email,
            }
          : null,
        user.isAdmin
          ? {
              role: 'admin',
              user_name: user.name,
              id: user.id,
              username: user.email,
            }
          : null,
      ])
      .filter((role: any) => role !== null);

    console.log(updatedUsers);

    const formData = new FormData();

    formData.append('data', JSON.stringify(updatedUsers));

    this._login.editUserRole(formData).subscribe({
      next: (res) => {
        this._alert.hideLoading();
        this._alert.showAlert('success', 'Role Updated!');
        this.users = [];
        this.initialState = [];
        this.fetchUsers();
      },
      error: (err) => {
        this._alert.hideLoading();
        this._alert.showAlert(
          'danger',
          'Something went wrong, please try again!'
        );
      },
    });
  }

  getUsersControls() {
    return (this.userForm.get('users') as FormArray).controls;
  }
  openModal() {
    if (this.addEditVendor) {
      this.ngbModalService.open(this.addEditVendor, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
      });
    }
  }
}
