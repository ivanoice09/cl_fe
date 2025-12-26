import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Page } from "../../models/Page";
import { ProductListDto } from "../../models/admin/products/ProductListDto";
import { ProductDetailDto } from "../../models/admin/products/ProductDetailDto";

@Injectable({
    providedIn: 'root',
})
export class AdminProductHttp {

    private apiUrl = 'https://localhost:7000/api/admin'

    constructor(private http: HttpClient) {}

    getPagedProducts(page: number, pageSize: number, search?: string): Observable<Page<ProductListDto>> {
        let url = `${this.apiUrl}/products?page=${page}&pageSize=${pageSize}`;
        if (search && search.trim() !== '') {
            url += `&search=${encodeURIComponent(search)}`;
        }
        return this.http.get<Page<ProductListDto>>(url);
    }

    getProductDetail(productId: number): Observable<ProductDetailDto> {
        return this.http.get<ProductDetailDto>(`${this.apiUrl}/products/${productId}`);
    }

    updateProduct(product: ProductDetailDto): Observable<ProductDetailDto> {
        const url = `${this.apiUrl}/products/${product.productId}`;
        return this.http.put<ProductDetailDto>(url, product);
    }
}