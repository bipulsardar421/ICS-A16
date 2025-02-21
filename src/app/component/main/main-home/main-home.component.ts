import { Component } from '@angular/core';
import { VendorComponent } from "../vendor/vendor.component";
import { ProductComponent } from "../product/product.component";

@Component({
  selector: 'app-main-home',
  imports: [VendorComponent, ProductComponent],
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.css'
})
export class MainHomeComponent {

}
