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

  totalCount = 0;

  page = 1;
  pageSize = 20;

  sortBy = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  isLoading = true;

  constructor(private productService: AdminProductHttp) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;

    this.productService
      .getProducts(this.page, this.pageSize, this.sortBy, this.sortDirection)
      .subscribe({
        next: res => {
          this.products = res.items;
          this.totalCount = res.totalCount;
          this.isLoading = false;
        },
        error: err => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  changeSort(column: string) {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }

    this.loadProducts();
  }

  nextPage() {
    this.page++;
    this.loadProducts();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

}
