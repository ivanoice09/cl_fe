import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminProductEditDto } from '../../models/admin/product/AdminProductEditDto';
import { AdminCategoryDto } from '../../models/admin/product/AdminProductCategoryDto';
import { AdminProductModelDto } from '../../models/admin/product/AdminProductModelDto';
import { AdminProductUpdateDto } from '../../models/admin/product/AdminProductUpdateDto';
import { ProductList } from '../../models/ProductList';
import { Page } from '../../models/Page';
import { AdminProductCreateDto } from '../../models/admin/product/AdminProductCreateDto';
import { AdminProductDetailDto } from '../../models/admin/product/AdminProductDetailDto';
import { AdminProductListDto } from '../../models/admin/product/AdminProductListDto';

@Injectable({
  providedIn: 'root',
})
export class AdminProductHttp {
  private readonly apiUrl = 'https://localhost:7000/api/admin/products';

  constructor(private http: HttpClient) { }

  getProductList(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    search?: string
  ): Observable<Page<AdminProductListDto>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // search
    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }

    // sorting
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    if (sortDirection) {
      params = params.set('sortDirection', sortDirection);
    }

    return this.http.get<Page<ProductList>>(this.apiUrl, { params });
  }

  getProductDetail(productId: number): Observable<AdminProductDetailDto> {
    return this.http.get<AdminProductDetailDto>(`${this.apiUrl}/GetProductDetail/${productId}`);
  }

  getProductToEdit(productId: number): Observable<AdminProductEditDto> {
    return this.http.get<AdminProductEditDto>(`${this.apiUrl}/GetProductToEdit/${productId}`);
  }

  getCategories() {
    return this.http.get<AdminCategoryDto[]>(`${this.apiUrl}/categories`);
  }

  getModels() {
    return this.http.get<AdminProductModelDto[]>(`${this.apiUrl}/models`);
  }

  // UPDATE
  updateProduct(dto: AdminProductUpdateDto) {
    return this.http.put(`${this.apiUrl}/${dto.productId}`, dto);
  }

  // CREATE
  createProduct(dto: AdminProductCreateDto) {
    return this.http.post<number>(this.apiUrl, dto);
  }
}
