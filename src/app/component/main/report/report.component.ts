import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-report',
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {
  reportForm!: FormGroup;
  selectedDate!: Date;
  reportData: any[] = [];
  maxDate: string = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  generateReport(): void {
    if (this.reportForm.valid) {
      const { startDate, endDate } = this.reportForm.value;

      console.log('Generating report for:', startDate, endDate);

      this.reportData = [
        { description: 'Item 1', amount: 100 },
        { description: 'Item 2', amount: 150 },
      ];
    }
  }

  getTotal(): number {
    return this.reportData.reduce((total, item) => total + item.amount, 0);
  }
}
