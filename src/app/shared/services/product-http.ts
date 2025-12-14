import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetail } from '../models/ProductDetail';
import { ProductCard } from '../models/ProductCard';
import { Page } from '../models/Page';
import { Category } from '../models/Category ';
import { MainCategory } from '../models/MainCategory';

@Injectable({
  providedIn: 'root',
})
export class ProductHttp {
  constructor(
    private http: HttpClient // , private auth: Auth
  ) {}
  private baseUrl = 'https://localhost:7000/api/products';

  GetProduct(): Observable<any> {
    return this.http.get(
      'https://localhost:7000/api/Products/paged'
      //  , { headers: this.auth.authenticationJwtHeader }
    );
  }

  GetProductP(
    page: number = 1, 
    categoryId?: number, 
    mainCategory?: MainCategory | null
  ): Observable<Page<ProductCard>> {

    // let url = `${this.baseUrl}/paged?pageNumber=${pageNumber}`;
    let params: any = { pageNumber: page };

    // if (categoryId !== undefined && categoryId !== null) {
    //   url += `&categoryId=${categoryId}`;
    // }
    if (categoryId) params.categoryId = categoryId;
    if (mainCategory) params.mainCategory = mainCategory;

    return this.http.get<Page<ProductCard>>(
      `${this.baseUrl}/paged`, { params }
    );
  }

  // Modificato per aggiungere main cateogry come parametro
  GetCategories(mainCategory?: MainCategory | null): Observable<Category[]> {
    let params: any = {};
    if (mainCategory) params.mainCategory = mainCategory;
    return this.http.get<Category[]>(`${this.baseUrl}/categories`, { params });
  }

  GetProductDetail(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`https://localhost:7000/api/Products/${id}`);
  }

  SearchProduct(query: string, minPrice?: number, maxPrice?: number): Observable<Page<ProductCard>> {
    let url = `https://localhost:7000/api/ProductSearch?query=${query}&pageNumber=1&pageSize=12`;

    if (minPrice !== undefined) {
        url += `&minPrice=${minPrice}`;
    }

    if (maxPrice !== undefined) {
        url += `&maxPrice=${maxPrice}`;
    }

    return this.http.get<Page<ProductCard>>(url);
}

}
