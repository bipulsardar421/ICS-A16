import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  products = [
    { name: "FUJIFILM | DSLR", image: "https://placehold.co/200x200", quantity: 130 },
    { name: "GPU | RTX 2080", image: "https://placehold.co/200x200", quantity: 100 },
    { name: "IPHONE 8 | PRO", image: "https://placehold.co/200x200", quantity: 50 },
    { name: "COSMETIC | MAKEUP KIT", image: "https://placehold.co/200x200", quantity: 75 },
    { name: "FUJIFILM | DSLR", image: "https://placehold.co/200x200", quantity: 200 }
  ];
}
