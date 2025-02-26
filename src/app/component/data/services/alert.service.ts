import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  isVisible = false;
  message = '';
  alertType: string = '';
  isLoading: boolean = false;
  showAlert(type: string, message: string) {
    this.message = message;
    this.alertType = type;
    this.isVisible = true;
    setTimeout(() => this.hideAlert(), 3000);
  }

  hideAlert() {
    this.isVisible = false;
  }

  showLoading() {
    this.isLoading = true;
  }

  hideLoading() {
    this.isLoading = false;
  }
}
