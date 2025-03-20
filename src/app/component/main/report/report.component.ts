import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReportService } from '../../data/services/report/report.service';
import { ReportData } from '../../data/interfaces/report.interface';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  reportForm: FormGroup;
  reportData: ReportData | null = null;
  maxDate: string = new Date().toISOString().split('T')[0]; // Today’s date as max

  // Column definitions for tables
  stockColumns = [
    'product_id',
    'product_name',
    'stock_on_hand',
    'rate',
    'recieved_date',
    'supplier',
  ];
  vendorColumns = [
    'vendor_id',
    'vendor_name',
    'contact_person',
    'phone',
    'product_name',
    'supplied_quantity',
    'rate',
    'recieved_date',
  ];
  invoiceDateColumns = [
    'invoice_date',
    'invoice_count',
    'total_amount',
    'payment_status',
    'invoice_ids',
  ];
  invoiceClientColumns = [
    'client_id',
    'client_name',
    'invoice_count',
    'total_amount',
    'payment_status',
    'invoice_ids',
  ];
  invoiceProductColumns = [
    'product_id',
    'product_name',
    'total_quantity_sold',
    'total_amount',
    'invoice_count',
  ];

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.reportForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  generateReport(): void {
    if (this.reportForm.invalid) return;

    // Prepare FormData manually since FormDataConverter.toFormData might not be available
    const formData = new FormData();
    formData.append('startDate', this.reportForm.get('start')?.value);
    formData.append('endDate', this.reportForm.get('end')?.value);

    this.reportService.getReport(formData).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.reportData = response.data;
        }
      },
      (error) => {
        console.error('Error fetching report data:', error);
      }
    );
  }
  printReport() {
    window.print();
  }
}
