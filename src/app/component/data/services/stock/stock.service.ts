import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private userdetails: string = `${this.apiService.getBaseUrl()}/stock/view`;
  private stockAddUrl: string = `${this.apiService.getBaseUrl()}/stock/add`;
  private stockUpdateUrl: string = `${this.apiService.getBaseUrl()}/stock/update`;

  
  private stockUpdated = new Subject<void>();

  getStock(): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.userdetails, {}, { headers, withCredentials: true });
  }

  addStock(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.stockAddUrl, formData, { headers, withCredentials: true });
  }

  updateStock(productId: number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    formData.append('id', productId.toString()); 
    return this.http.post(this.stockUpdateUrl, formData, { headers, withCredentials: true });
  }

  notifyStockUpdate() {
    this.stockUpdated.next();
  }

  
  getStockUpdateListener(): Observable<void> {
    return this.stockUpdated.asObservable();
  }
}
