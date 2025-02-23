import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private userdetails: string = `${this.apiService.getBaseUrl()}/userdetails`;
  // private genOtpUrl: string = `${this.apiService.getBaseUrl()}/login/gen-otp`;
  // private matchOtpUrl: string = `${this.apiService.getBaseUrl()}/login/match-otp`;
  // private changePwdUrl: string = `${this.apiService.getBaseUrl()}/login/change-pwd`;


  getDetails(): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.userdetails, {}, {
      headers,
      withCredentials: true,
    });
  }

}
