import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../data/services/alert.service';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-alert',
  imports: [NgbAlertModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  constructor(public alertService: AlertService) {}

  close() {
    this.alertService.hideAlert();
  }
  hide() {
    this.alertService.hideLoading();
  }
}
