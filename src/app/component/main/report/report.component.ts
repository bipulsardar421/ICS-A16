import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReportService } from '../../data/services/report/report.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  reportForm: FormGroup;
  reportData: any[] = [];
  reportType: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.reportForm = this.fb.group({
      reportType: ['', Validators.required],
      productName: [''],
      date: [''],
      vendorName: [''],
      clientName: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {}

  onReportTypeChange(): void {
    this.reportType = this.reportForm.get('reportType')?.value;
    this.reportData = [];
    this.error = null;

    this.reportForm.patchValue({
      productName: '',
      date: '',
      vendorName: '',
      clientName: '',
      startDate: '',
      endDate: '',
    });
  }

  onSubmit(): void {
    if (this.reportForm.invalid) {
      this.error = 'Please select a report type.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.reportData = [];
    this.reportType = this.reportForm.value.reportType;

    const reportPayload: any = {
      reportType: this.reportType,
    };

    switch (this.reportType) {
      case 'stock':
        if (this.reportForm.value.productName)
          reportPayload.productName = this.reportForm.value.productName;
        if (this.reportForm.value.date)
          reportPayload.date = this.reportForm.value.date;
        break;
      case 'vendor':
        if (this.reportForm.value.vendorName)
          reportPayload.vendorName = this.reportForm.value.vendorName;
        break;
      case 'invoice':
        if (this.reportForm.value.date)
          reportPayload.date = this.reportForm.value.date;
        if (this.reportForm.value.clientName)
          reportPayload.clientName = this.reportForm.value.clientName;
        if (this.reportForm.value.productName)
          reportPayload.productName = this.reportForm.value.productName;
        break;
      case 'customersbydaterange':
        reportPayload.startDate = this.reportForm.value.startDate;
        reportPayload.endDate = this.reportForm.value.endDate;
        if (!reportPayload.startDate || !reportPayload.endDate) {
          this.error = 'Start date and end date are required for this report.';
          this.loading = false;
          return;
        }
        break;
      case 'mostsoldproduct':
        if (this.reportForm.value.startDate && this.reportForm.value.endDate) {
          reportPayload.startDate = this.reportForm.value.startDate;
          reportPayload.endDate = this.reportForm.value.endDate;
        }
        break;
    }

    this.reportService.getReport(reportPayload).subscribe({
      next: (data) => {
        this.reportData = data;

        console.log(this.reportData);
        this.loading = false;
      },
      error: (err) => {
        this.error =
          err.error?.error || 'An error occurred while fetching the report.';
        this.loading = false;
      },
    });
  }

  printReport(): void {
    window.print();
  }

  resetForm(): void {
    this.reportForm.reset();
    this.reportType = null;
    this.reportData = [];
    this.error = null;
  }
}
