import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService, ModalType } from '../../../data/services/modal.service';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../data/interfaces/cart.interface';
import { AuthService } from '../../../data/services/auth/auth.service';
import { CartService } from '../../../data/services/cart/cart.service';
import { FormDataConverter } from '../../../data/helper/formdata.helper';
import { InvoiceService } from '../../../data/services/invoice/invoice.service';
import { AlertService } from '../../../data/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {
  authService = inject(AuthService);
  userRole$ = this.authService.userRole$;
  private router = inject(Router);
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);

  private user_details: any = localStorage.getItem('user_details')
    ? JSON.parse(localStorage.getItem('user_details')!)
    : null;

  invoiceForm!: FormGroup;
  paymentStatusOptions = ['Pending', 'Paid', 'Cancelled'];
  paymentMethods = ['Cash', 'Card', 'Bank'];

  products: CartItem[] = [];
  customerType = 'self';
  @ViewChild('invoice_modal') invoice_modalContent!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    public _cartService: CartService,
    private _invoiceService: InvoiceService,
    private _alert: AlertService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupGrandTotalCalculation();
    this.modalService.openModalEvent.subscribe((modalType: ModalType) => {
      if (modalType === ModalType.INVOICE) {
        this.openModal();
      }
    });
    this.modalService.dataTransferObject.subscribe((data: any) => {
      this.products = data;
    });
  }

  initializeForm() {
    const currentDate = new Date().toISOString().slice(0, 10);
    this.invoiceForm = this.fb.group({
      customer_name: [
        { value: this.user_details.user_name, disabled: true },
        [Validators.required, Validators.maxLength(255)],
      ],
      customer_contact: [
        { value: this.user_details.phone, disabled: true },
        [Validators.required, Validators.maxLength(20)],
      ],
      invoice_date: [currentDate, Validators.required],
      total_amount: [
        this._cartService.getTotalPrice(),
        [Validators.required, Validators.min(0)],
      ],
      discount: [0, [Validators.min(0)]],
      tax: [0, [Validators.min(0)]],
      grand_total: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
      payment_status: ['Pending', Validators.required],
      payment_method: ['', [Validators.required, Validators.maxLength(4)]],
      notes: [''],
    });
  }
  onCustomerTypeChange(type: string) {
    this.customerType = type;

    if (type === 'self') {
      this.invoiceForm.patchValue({
        customer_name: 'abc',
        customer_contact: '123',
      });
      this.invoiceForm.get('customer_name')?.disable();
      this.invoiceForm.get('customer_contact')?.disable();
    } else {
      this.invoiceForm.get('customer_name')?.enable();
      this.invoiceForm.get('customer_contact')?.enable();
      this.invoiceForm.patchValue({ customer_name: '', customer_contact: '' });
    }
  }
  setupGrandTotalCalculation() {
    this.invoiceForm.valueChanges.subscribe(() => {
      this.calculateGrandTotal();
    });
  }

  calculateGrandTotal() {
    const totalAmount = this.invoiceForm.get('total_amount')?.value || 0;
    const discount = this.invoiceForm.get('discount')?.value || 0;
    const tax = this.invoiceForm.get('tax')?.value || 0;
    const discountedAmount = totalAmount - (totalAmount * discount) / 100;
    const grandTotal = discountedAmount + (discountedAmount * tax) / 100;
    this.invoiceForm.patchValue(
      { grand_total: grandTotal.toFixed(2) },
      { emitEvent: false }
    );
  }
  submitForm(): void {
    if (this.invoiceForm.valid) {
      const formData = FormDataConverter.toFormData(this.invoiceForm);
      formData.append('cartData', JSON.stringify(this.products));
      this._alert.showLoading();
      this._invoiceService.addInvoiceDetails(formData).subscribe({
        next: (response) => {
          this._alert.hideLoading();
          this._alert.showAlert('success', response.message);
          this.closeModal();
          this._cartService.resetCart();
          this.router.navigate(['/main/home']);
        },
        error: (error) => {
          this._alert.showAlert('danger', error.message);
        },
      });
    } else {
      this._alert.showAlert('danger', 'Please fill out the form fully!');
    }
  }

  openModal() {
    if (this.invoice_modalContent) {
      this.ngbModalService.open(this.invoice_modalContent, {
        ariaLabelledBy: 'modal-basic-title',
      });
    }
  }
  closeModal() {
    if (this.invoice_modalContent) {
      this.ngbModalService.dismissAll();
    }
  }
}
