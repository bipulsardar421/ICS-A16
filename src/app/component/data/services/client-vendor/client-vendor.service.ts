import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientVendorService {
  private readonly baseUrl: string;
  private dataChangeSubject = new Subject<'client' | 'vendor'>();

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.baseUrl = `${this.apiService.getBaseUrl()}/users`;
  }

  public dataChanged$: Observable<'client' | 'vendor'> =
    this.dataChangeSubject.asObservable();

  public notifyDataChange(entityType: 'client' | 'vendor') {
    
    this.dataChangeSubject.next(entityType);
  }

  getAllClients(): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(
      `${this.baseUrl}/clients/view`,
      {},
      { headers, withCredentials: true }
    );
  }

  getClientById(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/clients/getById`, form, {
      headers,
      withCredentials: true,
    });
  }

  getClientByName(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/clients/getByName`, form, {
      headers,
      withCredentials: true,
    });
  }

  addClient(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/clients/add`, form, {
      headers,
      withCredentials: true,
    });
  }

  updateClient(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/clients/update`, form, {
      headers,
      withCredentials: true,
    });
  }

  deleteClient(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/clients/delete`, form, {
      headers,
      withCredentials: true,
    });
  }

  getAllVendors(): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(
      `${this.baseUrl}/vendors/view`,
      {},
      { headers, withCredentials: true }
    );
  }

  getVendorById(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/vendors/getById`, form, {
      headers,
      withCredentials: true,
    });
  }

  getVendorByName(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/vendors/getByName`, form, {
      headers,
      withCredentials: true,
    });
  }

  addVendor(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/vendors/add`, form, {
      headers,
      withCredentials: true,
    });
  }

  updateVendor(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/vendors/update`, form, {
      headers,
      withCredentials: true,
    });
  }

  deleteVendor(form: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/vendors/delete`, form, {
      headers,
      withCredentials: true,
    });
  }
}
