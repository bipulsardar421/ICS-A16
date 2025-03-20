import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map } from 'rxjs';
import { InvoiceService } from '../../data/services/invoice/invoice.service';
import { AuthService } from '../../data/services/auth/auth.service';

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
  paginatedInvoices: any[] = [];
  selectedInvoice: any = null;
  searchForm!: FormGroup;

  invoicesPerPage = 10;
  currentPage = 1;
  showMoreVisible = false;

  company = {
    name: 'ICS Application',
    address: 'India',
    city: 'Visakhapatnam, AP, 530016',
    phone: '+91 7749879756',
  };

  client: any = {};
  invoiceDetails: any = {};

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
      .subscribe((query) => this.filterInvoices(query));
  }

  getUserInvoices() {
      this.invoiceService.getAll().subscribe({
        next: (response) => {
          if (response.status !== 'error' && Array.isArray(response)) {
            this.invoices = response;
            this.filteredInvoices = [...this.invoices];
            this.resetPagination();
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
      })
    
  }

  filterInvoices(query: string) {
    this.filteredInvoices = this.invoices.filter((invoice) =>
      JSON.stringify(invoice).toLowerCase().includes(query)
    );
    this.resetPagination();
  }

  resetPagination() {
    this.currentPage = 1;
    console.log('Filtered Invoices:', this.filteredInvoices);
    this.paginatedInvoices = this.filteredInvoices.slice(
      0,
      this.invoicesPerPage
    );
    this.showMoreVisible =
      this.filteredInvoices.length > this.paginatedInvoices.length;
  }
  loadMore() {
    const nextPageInvoices = this.filteredInvoices.slice(
      this.currentPage * this.invoicesPerPage,
      (this.currentPage + 1) * this.invoicesPerPage
    );

    this.paginatedInvoices = [...this.paginatedInvoices, ...nextPageInvoices];
    this.currentPage++;

    this.showMoreVisible =
      this.paginatedInvoices.length < this.filteredInvoices.length;
  }
  selectInvoice(invoice: any) {
    this.client = {
      name: invoice.customer_name,
      phone: invoice.customer_contact,
    };
    this.invoiceDetails = { ...invoice };
  }

  getTotal() {
    return (
      this.invoiceDetails.items?.reduce(
        (sum: any, item: any) => sum + item.total_price,
        0
      ) || 0
    );
  }

  printInvoice() {
    window.print();
  }
}
