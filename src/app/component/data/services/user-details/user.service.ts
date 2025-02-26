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
  private userDetailsWithId: string = `${this.apiService.getBaseUrl()}/userdetails/get`;
  private userDetailsAdd: string = `${this.apiService.getBaseUrl()}/userdetails/add`;
  private userDetailsUpdate: string = `${this.apiService.getBaseUrl()}/userdetails/update`;

  getDetails(): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(
      this.userdetails,
      {},
      {
        headers,
        withCredentials: true,
      }
    );
  }
  getDetailsWithId(id: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.userDetailsWithId, id, {
      headers,
      withCredentials: true,
    });
  }

  addDetails(formdata: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.userDetailsAdd, formdata, {
      headers,
      withCredentials: true,
    });
  }

  editDetails(formdata: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.userDetailsUpdate, formdata, {
      headers,
      withCredentials: true,
    });
  }
}
