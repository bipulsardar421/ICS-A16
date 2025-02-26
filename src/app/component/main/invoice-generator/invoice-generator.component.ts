import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../data/interfaces/cart.interface';
import { CartService } from '../../data/services/cart/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService, ModalType } from '../../data/services/modal.service';
import { InvoiceComponent } from "../../common/pop-up-component/invoice/invoice.component";

@Component({
  selector: 'app-invoice-generator',
  imports: [CommonModule, FormsModule, InvoiceComponent],
  templateUrl: './invoice-generator.component.html',
  styleUrls: ['./invoice-generator.component.css'],
})
export class InvoiceGeneratorComponent {
  private modalService = inject(ModalService);

  products: CartItem[] = [];

  constructor(public _cartService: CartService) {}

  ngOnInit(): void {
    this._cartService.cart$.subscribe((cart) => {
      this.products = cart;
    });
  }

  removeProduct(index: number): void {
    this._cartService.removeItem(index);
  }

  totalPrice(): number {
    return this._cartService.getTotalPrice();
  }

  checkout(): void {
    this.proceedToGenerate();
  }

  proceedToGenerate() {
    this.modalService.dataTransferer(this.products);
    this.modalService.triggerOpenModal(ModalType.INVOICE);
  }
}
