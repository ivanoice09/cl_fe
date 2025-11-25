import { Injectable } from '@angular/core';
import { CustomerProfile } from '../models/CustomerProfile';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerHttp {
  private apiUrl = 'https://localhost:7000/api/Customers';

  constructor(private http: HttpClient) {}

  getCustomerProfile(customerId: number): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(`${this.apiUrl}/${customerId}`);
  }
  
}
