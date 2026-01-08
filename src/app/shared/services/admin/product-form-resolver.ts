import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AdminProductHttp } from './admin-product-http';
import { ReferenceData } from './reference-data';
import { forkJoin, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductFormResolver implements Resolve<any> {

  constructor(
    private adminProductHttp: AdminProductHttp,
    private referenceData: ReferenceData
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.paramMap.get('id');

    return forkJoin({
      categories: this.referenceData.getCategories(),
      models: this.referenceData.getModels(),
      product: id ? this.adminProductHttp.getProductToEdit(+id) : of(null)
    });
  }
}
