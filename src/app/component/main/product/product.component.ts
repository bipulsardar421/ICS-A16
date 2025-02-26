import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { StockService } from '../../data/services/stock/stock.service';
import { StockInterface } from '../../data/interfaces/stock.interface';
import { CartItem } from '../../data/interfaces/cart.interface';
import { CartService } from '../../data/services/cart/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule, RouterLink, ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  Math = Math;
  products: StockInterface[] = [];
  qtyMap: { [productId: string]: number } = {};
  cartItemCount: number = 0;

  constructor(
    private _stockService: StockService,
    private _cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getStockDetails();
    this._cartService.cart$.subscribe((cart) => {
      this.cartItemCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    });
  }

  getStockDetails() {
    this._stockService.getStock().subscribe({
      next: (response) => {
        this.products = response;
      },
      error: (error) => {
        console.error('Failed to fetch products', error);
      },
    });
  }

  addToCart(product: StockInterface) {
    const qty = this.qtyMap[product.product_id] || 0;
    if (qty <= 0) {
      alert('Please enter a valid quantity!');
      return;
    }
    if (qty > product.quantity) {
      alert(`Only ${product.quantity} items are available in stock!`);
      return;
    }
    const cartItem: CartItem = {
      productId: product.product_id,
      productName: product.product_name,
      productImage: product.image,
      quantity: qty,
      totalStock: product.quantity,
      price: product.rate,
    };

    this._cartService.addToCart(cartItem);
    product.quantity -= qty;

    this.qtyMap[product.product_id] = 0;
  }
}
