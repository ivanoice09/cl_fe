import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetail } from '../models/OrderDetail';

@Injectable({
  providedIn: 'root',
})
export class OrderHttp {
  private apiUrl = 'https://localhost:7000/api/Orders';

  constructor(private http: HttpClient) {}

  getOrderDetail(orderId: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.apiUrl}/${orderId}`);
  }
}
