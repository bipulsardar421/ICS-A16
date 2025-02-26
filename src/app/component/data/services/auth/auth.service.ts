import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, first } from 'rxjs/operators';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);

  private baseUrl: string = this.apiService.getBaseUrl();
  private sessionCheckUrl = `${this.baseUrl}/auth/session/check`;
  private logoutUrl = `${this.baseUrl}/auth/session/logout`;
  private getUserId = `${this.baseUrl}/auth/session/getId`;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private sessionCheckedSubject = new BehaviorSubject<boolean>(false);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();
  sessionChecked$ = this.sessionCheckedSubject.asObservable();

  constructor() {
    this.checkSession();
  }

  checkSession(): void {
    console.log('Checking session...');
    this.http
      .post<{ status: string; message: string; role?: string }>(
        this.sessionCheckUrl,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          const isAuthenticated = response.status === 'true';
          this.isAuthenticatedSubject.next(isAuthenticated);
          this.userRoleSubject.next(isAuthenticated ? response.role ?? null : null);
          this.sessionCheckedSubject.next(true);

          console.log('Session check response:', response);
          console.log('AuthService - isAuthenticated:', this.isAuthenticatedSubject.value);
          console.log('AuthService - User role:', this.userRoleSubject.value);
        }),
        catchError((error) => {
          console.error('Session check failed', error);
          this.isAuthenticatedSubject.next(false);
          this.userRoleSubject.next(null);
          this.sessionCheckedSubject.next(true);
          return of(null);
        })
      )
      .subscribe();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  logout(): void {
    this.http
      .post<{ status: string; message: string }>(
        this.logoutUrl,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(false);
          this.userRoleSubject.next(null);
          this.sessionCheckedSubject.next(false);
        }),
        catchError((error) => {
          console.error('Logout failed', error);
          return of(null);
        })
      )
      .subscribe();
  }

  getUID():
    Observable<any> {
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post(this.getUserId, {}, {
      headers,
      withCredentials: true,
    });
  }
}
