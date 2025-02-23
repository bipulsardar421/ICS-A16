import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-generator',
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-generator.component.html',
  styleUrls: ['./invoice-generator.component.css'],
})
export class InvoiceGeneratorComponent {
  products = [
    {
      name: 'Product 1',
      description: 'Description of Product 1',
      price: 20.0,
      quantity: 1,
      image:
        'https://storage.googleapis.com/a1aa/image/ihtpRk4-J3hHhi8RyeSPMcF5C6VPP4gXmY1m20qGr-M.jpg',
    },
    {
      name: 'Product 2',
      description: 'Description of Product 2',
      price: 35.0,
      quantity: 1,
      image:
        'https://storage.googleapis.com/a1aa/image/lFH1CfLlUx4rBmjN7-QLpUWiaxrP90xjwQLI8B-dv5c.jpg',
    },
    // Add other products similarly
  ];

  removeProduct(index: number): void {
    this.products.splice(index, 1);
  }

  totalPrice(): number {
    return this.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }

  checkout(): void {
    // Logic to handle checkout
    alert('Proceeding to checkout...');
  }
}
