import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetail } from '../models/ProductDetail';

@Injectable({
  providedIn: 'root',
})
export class ProductHttp {
  constructor(
    private http: HttpClient // , private auth: Auth
  ) {}

  GetProduct(): Observable<any> {
    return this.http.get(
      'https://localhost:7000/api/Products/paged'
      //  , { headers: this.auth.authenticationJwtHeader }
    );
  }

  GetProductP(pageNumber: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(
      `https://localhost:7000/api/Products/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  GetProductDetail(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`https://localhost:7000/api/Products/${id}`);
  }
}
