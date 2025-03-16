import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../data/services/invoice/invoice.service';
import { AuthService } from '../../data/services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map } from 'rxjs';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [NgFor, CommonModule, ReactiveFormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {
  authService = inject(AuthService);
  userRole$ = this.authService.userRole$;
  user_details: any = null;
  invoices: any[] = [];
  filteredInvoices: any[] = [];
  selectedInvoice: any = null;
  searchForm!: FormGroup;

  company = {
    name: 'ICS Application',
    address: 'India',
    city: 'Visakhapatnam, AP, 530016',
    phone: '+91 7749879756',
  };

  client: any = {
    name: '',
    phone: '',
  };

  invoiceDetails: any = {
    id: '',
    date: '',
    items: [],
  };

  constructor(
    private invoiceService: InvoiceService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user_details');
    if (userData) {
      this.user_details = JSON.parse(userData);
      this.getUserInvoices();
    }

    this.searchForm = this.fb.group({
      search: [''],
    });

    this.searchForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(300),
        map((query) => query.trim().toLowerCase())
      )
      .subscribe((query) => {
        this.filterInvoices(query);
      });
  }

  getUserInvoices() {
    if (this.user_details?.phone) {
      const uid = new FormData();
      uid.append('phone', this.user_details.phone);
      this.userRole$.subscribe((role) => {
        if (role === 'admin') {
          this.invoiceService.getAll().subscribe({
            next: (response) => {
              if (response.status !== 'error' && Array.isArray(response)) {
                this.invoices = response;
                this.filteredInvoices = [...this.invoices];
                if (this.filteredInvoices.length > 0) {
                  this.selectInvoice(this.filteredInvoices[0]);
                }
              } else {
                this.invoices = [];
                this.filteredInvoices = [];
              }
            },
            error: (error) => {
              console.error('API Call Failed:', error);
            },
          });
        } else {
          this.invoiceService.getInvoiceDetails(uid).subscribe({
            next: (response) => {
              if (response.status !== 'error' && Array.isArray(response)) {
                this.invoices = response;
                this.filteredInvoices = [...this.invoices];
                if (this.filteredInvoices.length > 0) {
                  this.selectInvoice(this.filteredInvoices[0]);
                }
              } else {
                this.invoices = [];
                this.filteredInvoices = [];
              }
            },
            error: (error) => {
              console.error('API Call Failed:', error);
            },
          });
        }
      });
    }
  }

  filterInvoices(query: string) {
    this.filteredInvoices = this.invoices.filter((invoice) => {
      const invoiceId = invoice.invoice_id ? String(invoice.invoice_id) : '';

      return invoiceId.includes(query);
    });
    if (this.filteredInvoices.length > 0) {
      this.selectInvoice(this.filteredInvoices[0]);
    } else {
      this.selectedInvoice = null;
      this.client = { name: '', phone: '' };
      this.invoiceDetails = { id: '', date: '', items: [] };
    }
  }

  selectInvoice(invoice: any) {
    this.selectedInvoice = invoice;

    this.client = {
      name: invoice.customer_name || 'N/A',
      phone: invoice.customer_contact || 'N/A',
    };

    this.invoiceDetails = {
      id: invoice.invoice_id,
      date: invoice.invoice_date,
      items: invoice.items.map((item: any) => ({
        description: item.product_name,
        amount: item.total_price,
      })),
    };
  }

  getTotal() {
    return this.invoiceDetails.items
      .reduce((sum: number, item: any) => sum + item.amount, 0)
      .toFixed(2);
  }

  printInvoice() {
    const invoiceElement = document.querySelector('.main-content');
    if (invoiceElement) {
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .main-content { width: 100%; padding: 20px; }
            </style>
          </head>
          <body>
            ${invoiceElement.outerHTML}
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.focus();
      printWindow?.print();
      printWindow?.close();
    }
  }
}
