import { Component } from '@angular/core';
import { ProductList } from '../../../shared/models/ProductList';
import { AdminProductHttp } from '../../../shared/services/admin/admin-product-http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {

  products: ProductList[] = [];
  isLoading = true;

  constructor(private productService: AdminProductHttp) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: res => {
        this.products = res;
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    })
  }

}
