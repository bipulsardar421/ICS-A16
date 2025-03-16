import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../interfaces/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  addToCart(item: CartItem) {
    const existingItem = this.cartItems.find(
      (p) => p.productId === item.productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + item.quantity;
      if (newQuantity > item.totalStock) {
        alert(`Only ${item.totalStock} items available in stock!`);
        return;
      }
      existingItem.quantity = newQuantity;
      console.log('Bipul', existingItem);
    } else {
      this.cartItems.push(item);
      console.log('bipul_cart', this.cartItems);
    }

    this.cartSubject.next([...this.cartItems]);
  }

  updateCartQuantity(index: number, quantity: number) {
    if (quantity <= 0) {
      this.cartItems.splice(index, 1);
    } else {
      this.cartItems[index].quantity = quantity;
    }
    this.cartSubject.next([...this.cartItems]);
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.cartSubject.next([...this.cartItems]);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
  resetCart() {
    this.cartItems = [];
    this.cartSubject.next([]);
  }
}
