import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

  searchForm!: FormGroup;

  ngOnInit(): void {
    this.fetchBillData();
    this.initializeSearchForm();
    this.filteredBills = this.billData; // For initial rendering
  }

  fetchBillData(): void {
    this.billData = [
      {
        quantity: 3,
        item_id: 1,
        user_name: 'Bipul Sardar',
        invoice_id: 1,
        customer_name: 'Test Admin',
        product_name: 'abc',
        customer_contact: 12341234,
      },
      {
        quantity: 3,
        item_id: 3,
        user_name: 'Bipul Sardar',
        invoice_id: 1,
        customer_name: 'Test Admin',
        product_name: 'abc',
        customer_contact: 12341234,
      },
      {
        quantity: 5,
        item_id: 19,
        user_name: 'Bipul Sardar',
        invoice_id: 5,
        customer_name: 'Test Admin',
        product_name: 'abc',
        customer_contact: 12341234,
      },
      {
        quantity: 2,
        item_id: 13,
        user_name: 'Bipul Sardar',
        invoice_id: 4,
        customer_name: 'Test Admin',
        product_name: 'abc',
        customer_contact: 12341234,
      },
      {
        quantity: 11,
        item_id: 38,
        user_name: 'Bipul Sardar',
        invoice_id: 11,
        customer_name: 'Bipul Sardar',
        product_name: 'Test From Browser',
        customer_contact: 123456789,
      },
    ];
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
        bill.customer_contact.toString().includes(searchTerm)
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
    ); // Assuming unit price = 100
  }
}
