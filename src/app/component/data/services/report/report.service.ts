import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
 private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private report: string = `${this.apiService.getBaseUrl()}/report`;

  getReport(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.report, formData, {
      headers,
      withCredentials: true,
    });
  }
}
