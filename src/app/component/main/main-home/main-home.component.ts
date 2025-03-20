import { Component, inject, OnInit } from '@angular/core';
import { VendorComponent } from '../vendor/vendor.component';
import { ProductComponent } from '../product/product.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../data/services/auth/auth.service';
import { first, tap } from 'rxjs';
import { NewLoginHelperComponent } from "../../common/pop-up-component/new-login-helper/new-login-helper.component";
import { ModalService, ModalType } from '../../data/services/modal.service';

@Component({
  selector: 'app-main-home',
  imports: [ProductComponent, CommonModule, NewLoginHelperComponent],
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.css',
})
export class MainHomeComponent {
  authService = inject(AuthService);
  modalService = inject(ModalService);
  userRole$ = this.authService.userRole$;

  ngOnInit(): void {
    this.authService.sessionChecked$.pipe(
      first((checked) => checked),
      tap(() => {
        this.authService.getIsNewFun().subscribe({
          next: (res: any) => {
            console.log('getIsNew response:', res);
            const isNew = res?.isNew === 'true';
            if (isNew) {
              this.modalService.triggerOpenModal(ModalType.LOGINHELPER);
            }
          },
          error: (err) => console.error('Error:', err),
        });
      })
    ).subscribe();
  }
}
