import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string = 'http://localhost:8080/Java-Demo-Web-Application';

  constructor() {}

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
