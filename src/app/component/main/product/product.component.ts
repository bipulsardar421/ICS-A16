import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { StockService } from '../../data/services/stock/stock.service';
import { StockInterface } from '../../data/interfaces/stock.interface';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  products: StockInterface[] = [];
  qty: number = 0;
  constructor(private _stockService: StockService) { }
  ngOnInit(): void {
    this.getStockDetails();
  }
  getStockDetails() {
    this._stockService.getStock().subscribe({
      next: (response) => {
        this.products = response;
        if (response.status !== 'error') {
        } else {
        }
      },
      error: (error) => {
        console.error('Signup failed', error);
      },
    });
  }
}
