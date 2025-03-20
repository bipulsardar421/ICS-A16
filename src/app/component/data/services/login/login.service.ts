import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private loginUrl: string = `${this.apiService.getBaseUrl()}/login`;
  private genOtpUrl: string = `${this.apiService.getBaseUrl()}/login/gen-otp`;
  private matchOtpUrl: string = `${this.apiService.getBaseUrl()}/login/match-otp`;
  private changePwdUrl: string = `${this.apiService.getBaseUrl()}/login/change-pwd`;
  private userDetails: string = `${this.apiService.getBaseUrl()}/login/get-users`;
  private editUserRoleUrl: string = `${this.apiService.getBaseUrl()}/login/edit-role`;
  private resetPwdUrl: string = `${this.apiService.getBaseUrl()}/login/reset-pwd`;

  login(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

    return this.http.post(this.loginUrl, formData, {
      headers,
      withCredentials: true,
    });
  }

  genOtp(formData: FormData): Observable<any> {
    return this.http.post(this.genOtpUrl, formData, {
      headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
      withCredentials: true,
    });
  }

  matchOtp(formData: FormData): Observable<any> {
    return this.http
      .post(this.matchOtpUrl, formData, {
        headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          if (response.status === 'success') {
            console.log('Login successful:', response);
            this.authService.checkSession();
          }
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          throw error;
        })
      );
  }

  changePwd(formData: FormData): Observable<any> {
    return this.http.post(this.changePwdUrl, formData, {
      headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
      withCredentials: true,
    });
  }
  resetPwd(formData: FormData): Observable<any> {
    return this.http.post(this.resetPwdUrl, formData, {
      headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
      withCredentials: true,
    });
  }

  getUserDetails(formData: FormData): Observable<any> {
    return this.http.post(this.userDetails, formData, {
      headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
      withCredentials: true,
    });
  }
  editUserRole(formData: FormData): Observable<any> {
    return this.http.post(this.editUserRoleUrl, formData, {
      headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
      withCredentials: true,
    });
  }
}
