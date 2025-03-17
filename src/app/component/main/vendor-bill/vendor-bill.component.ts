import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InvoiceService } from '../../data/services/invoice/invoice.service';
import { AuthService } from '../../data/services/auth/auth.service';

interface BillItem {
  quantity: number;
  item_id: number;
  user_name: string;
  invoice_id: number;
  customer_name: string;
  product_name: string;
  customer_contact: number;
}

@Component({
  selector: 'app-vendor-bill',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendor-bill.component.html',
  styleUrl: './vendor-bill.component.css',
})
export class VendorBillComponent implements OnInit {
  billData: BillItem[] = [];
  filteredBills: BillItem[] = [];
  selectedBillItems: BillItem[] = [];
  selectedBillDetails: any = null;
  user_details: any = null;
  authService = inject(AuthService);
  userRole$ = this.authService.userRole$;

  searchForm!: FormGroup;
  constructor(private _invoice: InvoiceService) {}
  ngOnInit(): void {
    const userData = localStorage.getItem('user_details');
    if (userData) {
      this.user_details = JSON.parse(userData);
      this.fetchBillData();
    }
    this.initializeSearchForm();
    this.filteredBills = this.billData;
  }

  fetchBillData(): void {
    if (this.user_details?.user_id) {
      const uid = new FormData();
      uid.append('vendor_id', this.user_details.user_id);
      this.userRole$.subscribe((role) => {
        if (role === 'admin') {
          this._invoice.getAllVendorBillOnlyForAdmin().subscribe({
            next: (response: any) => {
              if (response.status !== 'error' && Array.isArray(response)) {
                this.billData = response;
                this.filteredBills = [...this.billData];
                if (this.filteredBills.length > 0) {
                  this.selectBill(this.filteredBills[0].invoice_id);
                }
              } else {
                this.billData = [];
                this.filteredBills = [];
              }
            },
            error: (error: any) => {
              console.error('API Call Failed:', error);
            },
          });
        } else {
          this._invoice.getParticularBillForVendor(uid).subscribe({
            next: (response: any) => {
              if (response.status !== 'error' && Array.isArray(response)) {
                this.billData = response;
                this.filteredBills = [...this.billData];
                if (this.filteredBills.length > 0) {
                  this.selectBill(this.filteredBills[0].invoice_id);
                }
              } else {
                this.billData = [];
                this.filteredBills = [];
              }
            },
            error: (error: any) => {
              console.error('API Call Failed:', error);
            },
          });
        }
      });
    }
  }

  initializeSearchForm(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });

    this.searchForm.get('search')?.valueChanges.subscribe((value) => {
      this.filterBills(value);
    });
  }

  filterBills(query: string): void {
    const searchTerm = query.toLowerCase();
    this.filteredBills = this.billData.filter(
      (bill) =>
        bill.customer_name.toLowerCase().includes(searchTerm) ||
        bill.invoice_id.toString().includes(searchTerm) ||
        bill.customer_contact.toString().includes(searchTerm) ||
        bill.product_name.toLowerCase().includes(searchTerm)
    );
  }

  selectBill(invoiceId: number): void {
    this.selectedBillItems = this.billData.filter(
      (item) => item.invoice_id === invoiceId
    );
    const billDetails = this.selectedBillItems[0];
    this.selectedBillDetails = {
      invoice_id: billDetails.invoice_id,
      customer_name: billDetails.customer_name,
      customer_contact: billDetails.customer_contact,
    };
  }

  getTotal(): number {
    return this.selectedBillItems.reduce(
      (total, item) => total + item.quantity * 100,
      0
    );
  }
}
