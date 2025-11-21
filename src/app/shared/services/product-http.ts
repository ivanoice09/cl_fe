import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetail } from '../models/ProductDetail';
import { ProductCard } from '../models/ProductCard';
import { Page } from '../models/Page';
import { Category } from '../models/Category ';

@Injectable({
  providedIn: 'root',
})
export class ProductHttp {
  constructor(
    private http: HttpClient // , private auth: Auth
  ) { }
   private baseUrl = 'https://localhost:7000/api/products';

  GetProduct(): Observable<any> {
    return this.http.get(
      'https://localhost:7000/api/Products/paged'
      //  , { headers: this.auth.authenticationJwtHeader }
    );
  }

  GetProductP(
    pageNumber: number = 1, 
    categoryId?: number
  ): Observable<Page<ProductCard>> {
    let url = `${this.baseUrl}/paged?pageNumber=${pageNumber}`;
    
    if (categoryId !== undefined && categoryId !== null) {
      url += `&categoryId=${categoryId}`;
    }
    
    return this.http.get<Page<ProductCard>>(url);
  }

  GetCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  GetProductDetail(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`https://localhost:7000/api/Products/${id}`);
  }
}
