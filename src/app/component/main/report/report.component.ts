import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormDataConverter } from '../../data/helper/formdata.helper';
import { ReportService } from '../../data/services/report/report.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit {
  reportForm!: FormGroup;
  selectedDate!: string;
  reportData: any[] = [];
  maxCustomerData: any[] = [];
  maxInvoiceData: any[] = [];
  maxDate: string = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder, private reportService: ReportService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.reportForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

  generateReport(): void {
    if (this.reportForm.valid) {
      const formdata = FormDataConverter.toFormData(this.reportForm);
      
      this.reportService.getReport(formdata).subscribe({
        next: (res) => {
          this.reportData = res.reportData || [];
          this.maxCustomerData = res.maxCustomerData || [];
          this.maxInvoiceData = res.maxInvoiceData || [];
          this.selectedDate = this.reportForm.value.startDate;
        },
        error: (err) => {
          console.error('Error fetching report:', err);
        },
      });
    }
  }

  getTotal(): number {
    return this.reportData.reduce((total, item) => total + (item.total_quantity || 0), 0);
  }
}
