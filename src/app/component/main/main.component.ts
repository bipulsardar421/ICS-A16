import { Component } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { MainNavigationComponent } from "./main-navigation/main-navigation.component";
import { VendorComponent } from "./vendor/vendor.component";
import { ProductComponent } from "./product/product.component";
import { ReportComponent } from "./report/report.component";
import { InvoiceComponent } from "./invoice/invoice.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [MainNavigationComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
