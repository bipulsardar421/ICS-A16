import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-invoice',
  imports: [NgFor, CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent {
  invoices = [
    'Invoice_2024_08_21.kdf',
    'Invoice_2021_07_01.kdf',
    'Invoice_2023_06_21.kdf',
    'Invoice_2022_08_29.kdf',
    'Invoice_2022_08_27.kdf',
    'Invoice_2022_05_21.kdf',
    'Invoice_2024_08_21.kdf',
    'Invoice_2021_07_01.kdf',
    'Invoice_2023_06_21.kdf',
    'Invoice_2022_08_29.kdf',
    'Invoice_2022_08_27.kdf',
    'Invoice_2022_05_21.kdf',
    'Invoice_2024_08_21.kdf',
    'Invoice_2021_07_01.kdf',
    'Invoice_2023_06_21.kdf',
    'Invoice_2022_08_29.kdf',
    'Invoice_2022_08_27.kdf',
    'Invoice_2022_05_21.kdf',
    'Invoice_2024_08_21.kdf',
    'Invoice_2021_07_01.kdf',
    'Invoice_2023_06_21.kdf',
    'Invoice_2022_08_29.kdf',
    'Invoice_2022_08_27.kdf',
    'Invoice_2022_05_21.kdf',
    'Invoice_2024_08_21.kdf',
  ];

  company = {
    name: 'Company Name',
    address: 'Street Address',
    city: 'City, ST ZIP',
    phone: '(000) 000-0000',
  };

  client = {
    name: 'Client Name',
    company: 'Client Company',
    address: 'Client Street Address',
    city: 'Client City, ST ZIP',
    phone: 'Client Phone',
    email: 'Client Email',
  };

  invoiceDetails = {
    id: 123456,
    date: new Date().toISOString().split('T')[0],
    items: [
      { description: 'Service Fee', amount: 200.0 },
      { description: 'Service Fee x 3.517%', amount: 7.03 },
      { description: 'New discount', amount: -10.0 },
      { description: 'Tax 21.5% after discount', amount: 45.16 },
    ],
  };

  getTotal() {
    return this.invoiceDetails.items
      .reduce((sum, item) => sum + item.amount, 0)
      .toFixed(2);
  }

  printInvoice() {
    window.print();
  }
}
