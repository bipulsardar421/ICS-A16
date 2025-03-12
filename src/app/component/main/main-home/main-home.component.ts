import { Component, inject, OnInit } from '@angular/core';
import { VendorComponent } from '../vendor/vendor.component';
import { ProductComponent } from '../product/product.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../data/services/auth/auth.service';

@Component({
  selector: 'app-main-home',
  imports: [VendorComponent, ProductComponent, CommonModule],
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.css',
})
export class MainHomeComponent{
  authService = inject(AuthService);
  userRole$ = this.authService.userRole$;

 
}
