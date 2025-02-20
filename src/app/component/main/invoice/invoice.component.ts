import { CurrencyPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-invoice',
  imports: [CurrencyPipe, NgFor],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  invoices = [
    {
      name: "Invoice_2024_08_21_kdf",
      companyName: "[Company Name]",
      address: "[Street Address]",
      city: "[City, ST ZIP Code]",
      phone: "(555) 555-5555",
      billTo: {
        name: "[Name]",
        company: "[Company Name]",
        address: "[Street Address]",
        city: "[City, ST ZIP Code]",
        phone: "[Phone number]",
        email: "[Email address]",
      },
      invoiceNumber: 123456,
      date: "2024-08-21",
      items: [
        { description: "Service Fee", amount: 200.0 },
        { description: "Labor: 5 hours at $75/hr", amount: 375.0 },
        { description: "Tax: 8.25% of $575", amount: 47.44 },
        { description: "Total 2.5% discount", amount: -22.0 },
      ],
      total: 600.44,
      contactInfo: "[Name, Phone, and Email]",
    },
    {
      name: "Invoice_2023_06_21_kdf",
      companyName: "ABC Corp",
      address: "123 Market St",
      city: "San Francisco, CA 94105",
      phone: "(555) 123-4567",
      billTo: {
        name: "John Doe",
        company: "XYZ Ltd.",
        address: "789 Elm St",
        city: "Los Angeles, CA 90001",
        phone: "(555) 987-6543",
        email: "john.doe@example.com",
      },
      invoiceNumber: 654321,
      date: "2023-06-21",
      items: [
        { description: "Consulting", amount: 500.0 },
        { description: "Software License", amount: 150.0 },
        { description: "Tax: 10%", amount: 65.0 },
      ],
      total: 715.0,
      contactInfo: "support@abc.com",
    }
  ];

  selectedInvoice = this.invoices[0];

  selectInvoice(invoice: any) {
    this.selectedInvoice = invoice;
  }
}
