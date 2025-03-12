import {
  Component,
  inject,
  TemplateRef,
  ViewChild,
  OnInit,
  Inject,
  signal,
  DestroyRef,
} from '@angular/core';
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
import { AlertService } from '../../../data/services/alert.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-edit-vendor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-edit-vendor.component.html',
  styleUrl: './add-edit-vendor.component.css',
})
export class AddEditVendorComponent implements OnInit {
  @ViewChild('addEditVendor') addEditVendor!: TemplateRef<any>;

  private userId = localStorage.getItem('user_id');
  private destroyRef = inject(DestroyRef);
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private alertService = inject(AlertService);

  what: string = 'Add';
  dto!: UsersInterface;
  userForm!: FormGroup;
  users: any[] = [];
  initialState: any[] = [];
  users$!: Observable<any[]>;
  constructor() {
    this.userForm = this.fb.group({
      users: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.modalService.openModalEvent
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((modalType: ModalType) => {
        if (modalType === ModalType.VENDOR) {
          this.handleModalOpen();
        }
      });

    this.modalService.dataTransferObject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dto: any) => {
        if (dto) {
          this.what = dto.type;
          if (dto.type === 'edit') {
            this.dto = dto.data;
          }
        }
      });

    this.fetchUsers();
  }

  fetchUsers(): void {
    if (!this.userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.userId);

    this.alertService.showLoading();
    this.users$ = this.loginService.getUserDetails(formData);

    this.users$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (apiResponse) => {
        this.alertService.hideLoading();
        this.users = this.processUsers(apiResponse);
        this.initializeForm();
        this.storeInitialState();
      },
      error: () => {
        this.alertService.hideLoading();
        this.alertService.showAlert(
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
      role: user.role,
    }));
  }

  initializeForm(): void {
    const userControls = this.users.map((user) =>
      this.fb.group({
        id: [user.id],
        name: [user.name],
        email: [user.email],
        role: [user.role, Validators.required],
      })
    );

    this.userForm.setControl('users', this.fb.array(userControls));
  }

  storeInitialState(): void {
    this.initialState = JSON.parse(JSON.stringify(this.userForm.value.users));
  }

  submitRoles(): void {
    this.alertService.showLoading();

    const updatedUsers = this.userForm.value.users.filter(
      (user: any, index: number) =>
        JSON.stringify(user) !== JSON.stringify(this.initialState[index])
    );

    if (updatedUsers.length === 0) {
      this.alertService.hideLoading();
      this.alertService.showAlert('info', 'No changes detected.');
      return;
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify(updatedUsers));

    this.loginService.editUserRole(formData).subscribe({
      next: () => {
        this.alertService.hideLoading();
        this.alertService.showAlert('success', 'Roles Updated!');
        this.fetchUsers();
      },
      error: () => {
        this.alertService.hideLoading();
        this.alertService.showAlert(
          'danger',
          'Something went wrong, please try again!'
        );
      },
    });
  }

  get usersControls() {
    return (this.userForm.get('users') as FormArray).controls;
  }
  private handleModalOpen() {
    if (!this.ngbModalService.hasOpenModals()) {
      this.openModal();
    }
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
