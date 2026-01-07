import { Component, OnInit } from '@angular/core';
import { ProductList } from '../../../shared/models/ProductList';
import { AdminProductHttp } from '../../../shared/services/admin/admin-product-http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-product.html',
  styleUrl: './admin-product.scss',
})
export class Products implements OnInit {
  products: ProductList[] = [];

  page = 1;
  pageSize = 15;
  totalPages = 0;

  activeProductId: number | null = null;

  hasNext = false;
  hasPrevious = false;
  searchTerm: string = '';

  constructor(private productService: AdminProductHttp, private router: Router) {}

  goToEdit(productId: number, event: MouseEvent) {
    event.stopPropagation();
    this.activeProductId = null;
    console.log('navigate to product n°', productId);
    this.router.navigate(['/admin/products/edit', productId]);
  }

  goToCreate(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/admin/products/create']);
  }

  deleteProduct(productId: number) {

  }

  ngOnInit(): void {
    this.loadProducts();
  }

  onSearch() {
    this.page = 1;
    this.loadProducts();
  }

  loadProducts() {
    this.productService
      .getProductList(this.page, this.pageSize, this.searchTerm)
      .subscribe((res) => {
        this.products = res.items;
        this.totalPages = res.totalPages;
        this.hasNext = res.hasNext;
        this.hasPrevious = res.hasPrevious;
      });
  }

  nextPage() {
    if (this.hasNext) {
      this.page++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.hasPrevious) {
      this.page--;
      this.loadProducts();
    }
  }
}
