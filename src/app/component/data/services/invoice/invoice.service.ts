import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getInvoice: string = `${this.apiService.getBaseUrl()}/invoice`;
  private addInvoiceUrl: string = `${this.apiService.getBaseUrl()}/invoice/add`;
  private iAmAdmin: string = `${this.apiService.getBaseUrl()}/invoice/iamAdmin`;
  private getVendorBill: string = `${this.apiService.getBaseUrl()}/invoice/vendor-bill`;
  private getVendorBillWithId: string = `${this.apiService.getBaseUrl()}/invoice/vendor-bill-id`;

  getInvoiceDetails(user_id: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.getInvoice, user_id, {
      headers,
      withCredentials: true,
    });
  }
  addInvoiceDetails(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.addInvoiceUrl, form, {
      headers,
      withCredentials: true,
    });
  }
  getAll(): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(
      this.iAmAdmin,
      {},
      {
        headers,
        withCredentials: true,
      }
    );
  }
  getAllVendorBillOnlyForAdmin(): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(
      this.getVendorBill,
      {},
      {
        headers,
        withCredentials: true,
      }
    );
  }
  getParticularBillForVendor(user_id: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.getVendorBillWithId, user_id, {
      headers,
      withCredentials: true,
    });
  }
}
