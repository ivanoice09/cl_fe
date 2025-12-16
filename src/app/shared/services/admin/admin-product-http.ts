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

  getProducts(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
  ) {
    return this.http.get<any>(this.apiUrl, {
      params:  {
        pageNumber: page,
        pageSize: pageSize,
        sortBy: sortBy ?? '',
        sortDirection: sortDirection ?? 'asc'
      }
    });
  }
}
