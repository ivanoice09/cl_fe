import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductList } from '../../models/ProductList';

@Injectable({
  providedIn: 'root',
})
export class AdminProductHttp {
  private readonly apiUrl = 'https://localhost:7000/api/admin/products'

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductList[]> {
    return this.http.get<ProductList[]>(this.apiUrl);
  }
}
