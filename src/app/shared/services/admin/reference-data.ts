import { Injectable } from '@angular/core';
import { Observable, share, shareReplay } from 'rxjs';
import { AdminCategoryDto } from '../../models/admin/product/AdminProductCategoryDto';
import { AdminProductModelDto } from '../../models/admin/product/AdminProductModelDto';
import { AdminProductHttp } from './admin-product-http';

@Injectable({
  providedIn: 'root',
})
export class ReferenceData {
  private categories$?: Observable<AdminCategoryDto[]>;
  private models$?: Observable<AdminProductModelDto[]>;

  constructor(private adminHttpProduct: AdminProductHttp) {}

  getCategories(): Observable<AdminCategoryDto[]> {
    if (!this.categories$) {
      this.categories$ = this.adminHttpProduct.getCategories().pipe(
        shareReplay(1)
      );
    }
    return this.categories$;
  }

  getModels(): Observable<AdminProductModelDto[]> {
    if (!this.models$) {
      this.models$ = this.adminHttpProduct.getModels().pipe(
        shareReplay(1)
      );
    }
    return this.models$;
  }
}
