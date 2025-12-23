import { Injectable } from '@angular/core';
import { CustomerList } from '../../models/CustomerList';
import { CustomerDetail } from '../../models/CustomerDetail';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../models/Page';

@Injectable({
  providedIn: 'root',
})
export class AdminCustomerHttp {
  private apiUrl = 'https://localhost:7000/api/admin';

  constructor(private http: HttpClient) {}

  getCustomerList(page: number, pageSize: number, search?: string): Observable<Page<CustomerList>> {
    // Costruiamo l'URL base
    let url = `${this.apiUrl}/customers?page=${page}&pageSize=${pageSize}`;

    // Se 'search' esiste e non è una stringa vuota, la aggiungiamo all'URL
    if (search && search.trim() !== '') {
      url += `&search=${encodeURIComponent(search)}`;
    }

    return this.http.get<Page<CustomerList>>(url);
  }

  getCustomerDetail(customerId: number): Observable<CustomerDetail> {
    return this.http.get<CustomerDetail>(`${this.apiUrl}/customers/${customerId}`);
  }

  updateCustomer(customer: CustomerDetail): Observable<CustomerDetail> {
    const url = `${this.apiUrl}/customers/${customer.customerId}`;
    return this.http.put<CustomerDetail>(url, customer);
  }

  deleteCustomer(customerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/customers/${customerId}`);
  }
}
