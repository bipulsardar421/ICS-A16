import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-vendor',
  standalone: true, // If using standalone components
  imports: [CommonModule],
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'] // FIXED: should be an array
})
export class VendorComponent {
  vendors = [
    { name: "Vendor 1", phone: "1234567890", image: "https://placehold.co/100x100" },
    { name: "Vendor 2", phone: "0987654321", image: "https://placehold.co/100x100" },
    { name: "Vendor 3", phone: "1122334455", image: "https://placehold.co/100x100" },
    { name: "Vendor 4", phone: "6677889900", image: "https://placehold.co/100x100" },
    { name: "Vendor 5", phone: "5544332211", image: "https://placehold.co/100x100" },
    { name: "Vendor 6", phone: "9988776655", image: "https://placehold.co/100x100" },
    { name: "Vendor 7", phone: "2233445566", image: "https://placehold.co/100x100" },
    { name: "Vendor 8", phone: "1122446688", image: "https://placehold.co/100x100" },
    { name: "Vendor 9", phone: "6677998855", image: "https://placehold.co/100x100" },
    { name: "Vendor 10", phone: "9988224466", image: "https://placehold.co/100x100" }
  ];

  addVendor() {
    this.vendors.push({
      name: 'New Vendor',
      phone: '0000000000',
      image: 'https://placehold.co/100x100'
    });
  }

  deleteVendor(index: number) {
    this.vendors.splice(index, 1);
  }
}
