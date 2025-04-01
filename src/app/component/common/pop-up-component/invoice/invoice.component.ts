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
import { takeUntil, Subject } from 'rxjs';
import { ClientVendorService } from '../../../data/services/client-vendor/client-vendor.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {
  private destroy$ = new Subject<void>();
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(ModalService);
  private ngbModalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private invoiceService = inject(InvoiceService);
  private alertService = inject(AlertService);
  private client = inject(ClientVendorService);

  userRole$ = this.authService.userRole$;
  userDetails = this.getUserDetails();

  invoiceForm!: FormGroup;
  paymentStatusOptions = ['Pending', 'Paid', 'Cancelled'];
  paymentMethods = ['Cash', 'Card', 'Bank'];
  clients: { id: number; name: string; phone: string }[] = [];
  products: CartItem[] = [];
  customerType = 'self';

  @ViewChild('invoice_modal') invoiceModalContent!: TemplateRef<any>;
  @ViewChild('paymentModal') paymentModal!: TemplateRef<any>;
  ngOnInit(): void {
    this.initializeForm();
    this.setupGrandTotalCalculation();
    this.subscribeToModalEvents();
    this.fillClientArray();
  }

  private getUserDetails() {
    const userDetails = localStorage.getItem('user_details');
    return userDetails ? JSON.parse(userDetails) : null;
  }
  fillClientArray() {
    this.client.getAllClients().subscribe({
      next: (response: any) => {
        if (response?.data && Array.isArray(response.data)) {
          this.clients = response.data.map((client: any) => ({
            id: client.client_id,
            name: client.client_name,
            phone: client.phone,
          }));
        }
      },
      error: (err) => {
        console.error('Error fetching clients:', err);
      },
    });
  }
  onCustomerChange(event: Event): void {
    const selectedClientId = (event.target as HTMLSelectElement).value;
    const selectedClient = this.clients.find(
      (client) => client.id === +selectedClientId
    );

    if (selectedClient) {
      this.invoiceForm.patchValue({
        customer_id_display: selectedClient.id, 
        customer_name: selectedClient.name, 
        customer_contact: selectedClient.phone, 
      });
    }
  }

  private initializeForm(): void {
    const currentDate = new Date().toISOString().slice(0, 10);

    this.invoiceForm = this.fb.group({
      customer_id: ['', Validators.required], 
      customer_name: [{ value: '', disabled: true }, Validators.required], 
      customer_contact: [{ value: '', disabled: true }, Validators.required], 
      invoice_date: [
        { value: currentDate, disabled: true },
        Validators.required,
      ],
      total_amount: [
        { value: this.cartService.getTotalPrice(), disabled: true },
        Validators.required,
      ],
      discount: [{ value: 2, disabled: true }],
      tax: [{ value: 18, disabled: true }],
      grand_total: [{ value: 0, disabled: true }, Validators.required],
      payment_status: ['Pending', Validators.required],
      payment_method: ['', Validators.required],
      notes: [''],
    });

    this.checkRole();
    this.calculateGrandTotal();
  }

  checkRole(): void {
    this.userRole$.subscribe((roles: any) => {
      if (roles.includes('admin') || roles.includes('nuser')) {
        this.invoiceForm.get('customer_name')?.enable();
        this.invoiceForm.get('customer_contact')?.enable();
        this.invoiceForm.get('customer_name')?.reset();
        this.invoiceForm.get('customer_contact')?.reset();
      } else {
        this.invoiceForm.get('customer_name')?.disable();
        this.invoiceForm.get('customer_contact')?.disable();
      }
    });
  }

  private setupGrandTotalCalculation(): void {
    this.invoiceForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateGrandTotal());
  }

  private calculateGrandTotal(): void {
    const totalAmount = this.invoiceForm.get('total_amount')?.value || 0;

    const discount = 2;
    const tax = 18;

    const discountedAmount = totalAmount - (totalAmount * discount) / 100;
    const grandTotal = discountedAmount + (discountedAmount * tax) / 100;

    this.invoiceForm.patchValue(
      { grand_total: grandTotal.toFixed(2) },
      { emitEvent: false }
    );
  }

  submitForm(): void {
    if (this.invoiceForm.invalid) {
      this.alertService.showAlert('danger', 'Please fill out the form fully!');
      return;
    }

    const formData = FormDataConverter.toFormData(this.invoiceForm);
    formData.append('cartData', JSON.stringify(this.products));

    this.alertService.showLoading();

    this.invoiceService.addInvoiceDetails(formData).subscribe({
      next: (response) => {
        this.alertService.hideLoading();
        this.alertService.showAlert('success', response.message);
        this.closeModal();
        this.cartService.resetCart();
        this.router.navigate(['/main/home']);
      },
      error: (error) => {
        this.alertService.hideLoading();
        this.alertService.showAlert('danger', error.message);
      },
    });
  }

  private subscribeToModalEvents(): void {
    this.modalService.openModalEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe((modalType: ModalType) => {
        if (modalType === ModalType.INVOICE) {
          this.openModal();
        }
      });

    this.modalService.dataTransferObject
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CartItem[]) => {
        this.products = data;
      });
  }

  openModal(): void {
    this.ngbModalService.open(this.invoiceModalContent, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  closeModal(): void {
    this.ngbModalService.dismissAll();
  }
  openPaymentPopup() {
    this.ngbModalService.open(this.paymentModal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }
  userPayment() {
    this.invoiceForm.get('payment_status')?.setValue('Paid');
    this.submitForm();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
