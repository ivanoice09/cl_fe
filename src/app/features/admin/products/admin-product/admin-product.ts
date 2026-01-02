import { Component } from '@angular/core';
import { ProductListDto } from '../../../../shared/models/admin/products/ProductListDto';
import { AdminProductHttp } from '../../../../shared/services/admin/admin-product-http';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailDto } from '../../../../shared/models/admin/products/ProductDetailDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-product',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-product.html',
  styleUrl: './admin-product.scss',
})
export class AdminProduct {

  products: ProductListDto[] = [];

  selectedProduct?: ProductDetailDto;
  selectedProductId?: number;

  // Paginazione
  page = 1;
  pageSize = 15;
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;
  searchTerm: string = '';

  constructor(private adminProductHttp: AdminProductHttp, private router: Router) {}

  loadProducts() {
    this.adminProductHttp
      .getPagedProducts(this.page, this.pageSize, this.searchTerm)
      .subscribe((res) => {
        this.products = res.items;
        this.totalPages = res.totalPages;
        this.hasNext = res.hasNext;
        this.hasPrevious = res.hasPrevious;
      });
  }

  ngOnInit() {
    this.loadProducts();
  }

  onSearch() {
    this.page = 1;
    this.loadProducts();
  }

  editForm!: FormGroup;

  isEditing = false;

  startEdit() {

  }

  save() {
    // if (this.editForm.valid) {
    //   const payload = this.editForm.value;

    //   this.adminProductHttp.
    // }
  }

  selectProduct(productId: number) {
    if (this.selectedProductId === productId) {
      this.selectedProductId = undefined;
      this.selectedProduct = undefined;
      return;
    }

    this.adminProductHttp.getProductDetail(productId).subscribe((detail) => {
      this.selectedProductId = productId;
      this.selectedProduct = detail;
    });
  }

  goToEdit(productId: number, event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['admin/products/edit', productId]);
  }

  deleteProduct(productId: number) {

  }

  nextPage() {
    if (this.hasNext) {
      this.page++
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
