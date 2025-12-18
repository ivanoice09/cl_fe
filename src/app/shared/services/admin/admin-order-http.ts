import { Injectable } from '@angular/core';
import { OrderList } from '../../models/OrderList';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../models/Page';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderHttp {
  private urlApi = 'https://localhost:7000/api/admin';

  constructor(private http: HttpClient) {}

  getOrderList(page: number, pageSize: number, search?: string): Observable<Page<OrderList>> {
    let url = `${this.urlApi}/orders?page=${page}&pageSize=${pageSize}`;

    // Se 'search' esiste e non è una stringa vuota, la aggiungiamo all'URL
    if (search && search.trim() !== '') {
      url += `&search=${encodeURIComponent(search)}`;
    }

    return this.http.get<Page<OrderList>>(url);
  }

  getOrderDetail(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/orders/${orderId}`);
  }

  patchStatus(orderId: number, newStatus: number): Observable<void> {
    // Se il tuo backend si aspetta un oggetto come { status: 5 }
    return this.http.patch<void>(`${this.urlApi}/orders/${orderId}/status`, { status: newStatus });
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/orders/${orderId}`);
  }
}
