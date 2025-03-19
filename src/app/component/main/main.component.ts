import { Component, inject, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { VendorComponent } from './vendor/vendor.component';
import { ProductComponent } from './product/product.component';
import { ReportComponent } from './report/report.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { RouterOutlet } from '@angular/router';
import { ModalService, ModalType } from '../data/services/modal.service';
import { UserService } from '../data/services/user-details/user.service';
import { UserDetailsComponent } from '../common/pop-up-component/user-details/user-details.component';
import { AuthService } from '../data/services/auth/auth.service';
import { AlertService } from '../data/services/alert.service';
import { BehaviorSubject, map } from 'rxjs';
import { AddEditProductComponent } from '../common/pop-up-component/add-edit-product/add-edit-product.component';
import { AddEditVendorComponent } from "../common/pop-up-component/add-edit-users/add-edit-vendor.component";

@Component({
  selector: 'app-main',
  imports: [
    MainNavigationComponent,
    RouterOutlet,
    UserDetailsComponent,
    AddEditProductComponent,
    AddEditVendorComponent
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  private modalService = inject(ModalService);
  router: any;

  private userData = new BehaviorSubject<{
    name: string;
    role: string;
    profile_image: string;
  }>({
    name: '',
    role: '',
    profile_image: '',
  });
  user$ = this.userData.asObservable();
  constructor(
    private _user: UserService,
    private alertService: AlertService,
    private _auth: AuthService
  ) {}
  ngOnInit(): void {
    const id = localStorage.getItem('user_id');
    this.checkUserIsNew(id);
  }

  checkUserIsNew(id: any): void {
    const formData = new FormData();
    formData.append('id', id);
    this.alertService.showLoading();

    this._user.getDetailsWithId(formData).subscribe({
      next: (response) => {
        this.alertService.hideLoading();
        if (response.status === 'empty') {
          this.alertService.showAlert(
            'success',
            'Please complete your profile to proceed!'
          );
          this.openModel();
          this.modalService.dataTransferer(id);
        } else if (response.length > 0) {
          const user = response[0];
          localStorage.setItem('user_details', JSON.stringify(user));
          this.userData.next({
            name: user.user_name || 'Guest',
            role: user.role || 'Client',
            profile_image: user.image || '',
          });
        } else {
          this.alertService.showAlert('danger', 'Something went wrong!');
        }
      },
      error: (error) => {
        this.alertService.hideLoading();
        console.error('Signup failed', error);
      },
    });
  }

  openModel() {
    this.modalService.triggerOpenModal(ModalType.USER);
  }
}
