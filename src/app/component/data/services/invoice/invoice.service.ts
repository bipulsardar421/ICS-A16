import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getInvoice: string = `${this.apiService.getBaseUrl()}/invoice`;
  // private genOtpUrl: string = `${this.apiService.getBaseUrl()}/login/gen-otp`;
  // private matchOtpUrl: string = `${this.apiService.getBaseUrl()}/login/match-otp`;
  // private changePwdUrl: string = `${this.apiService.getBaseUrl()}/login/change-pwd`;


  getInvoiceDetails(user_id: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.getInvoice, user_id, {
      headers,
      withCredentials: true,
    });
  }
}
