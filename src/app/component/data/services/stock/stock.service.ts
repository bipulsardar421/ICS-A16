import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {
private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private userdetails: string = `${this.apiService.getBaseUrl()}/stock/view`;
  // private genOtpUrl: string = `${this.apiService.getBaseUrl()}/login/gen-otp`;
  // private matchOtpUrl: string = `${this.apiService.getBaseUrl()}/login/match-otp`;
  // private changePwdUrl: string = `${this.apiService.getBaseUrl()}/login/change-pwd`;


  getStock(): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.userdetails, {}, {
      headers,
      withCredentials: true,
    });
  }
}
