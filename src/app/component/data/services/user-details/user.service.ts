import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { Observable, Subject } from 'rxjs';
import { UsersInterface } from '../../interfaces/users.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private userdetails: string = `${this.apiService.getBaseUrl()}/userdetails/view`;
  private userDetailsWithId: string = `${this.apiService.getBaseUrl()}/userdetails/get`;
  private userDetailsAdd: string = `${this.apiService.getBaseUrl()}/userdetails/add`;
  private userDetailsUpdate: string = `${this.apiService.getBaseUrl()}/userdetails/update`;
  private userDetailsDelete: string = `${this.apiService.getBaseUrl()}/userdetails/delete`;
  private getcheckUserName: string = `${this.apiService.getBaseUrl()}/userdetails/checkUserName`;
  private getcheckPhone: string = `${this.apiService.getBaseUrl()}/userdetails/checkPhone`;

  private userUpdated = new Subject<UsersInterface>(); 
  userUpdated$ = this.userUpdated.asObservable(); 

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

  getClientDetails(): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(
      `${this.userdetails}/clients`,
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

  deleteDetails(formdata: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.userDetailsDelete, formdata, {
      headers,
      withCredentials: true,
    });
  }

  checkUserName(fd: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.getcheckUserName, fd, {
      headers,
      withCredentials: true,
    });
  }

  checkPhone(fd: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.getcheckPhone, fd, {
      headers,
      withCredentials: true,
    });
  }

  notifyUserUpdated(user: UsersInterface) { // New method to emit updates
    this.userUpdated.next(user);
  }
}