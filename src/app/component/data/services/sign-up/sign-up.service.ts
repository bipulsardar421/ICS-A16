import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private readonly registerUrl: string;
  private readonly matchOtpUrl: string;

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.registerUrl = `${this.apiService.getBaseUrl()}/signup/register`;
    this.matchOtpUrl = `${this.apiService.getBaseUrl()}/signup/match-otp`;
  }
  registerUser(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.registerUrl, formData, {
      headers,
      withCredentials: true,
    });
  }
  matchOtp(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.matchOtpUrl, formData, {
      headers,
      withCredentials: true,
    });
  }
}
