import { Component, OnInit } from '@angular/core';
import { ProductList } from '../../../shared/models/ProductList';
import { AdminProductHttp } from '../../../shared/services/admin/admin-product-http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminProductListDto } from '../../../shared/models/admin/product/AdminProductListDto';
import { AdminProductDetailDto } from '../../../shared/models/admin/product/AdminProductDetailDto';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-product.html',
  styleUrl: './admin-product.scss',
})
export class Products implements OnInit {
  products: AdminProductListDto[] = [];

  page = 1;
  pageSize = 20;
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;
  searchTerm: string = '';
  activeProductId: number | null = null;
  sortBy: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortLabel = 'Name';
  isLoading = false;
  modifiedFrom?: Date;
  modifiedTo?: Date;

  selectedProduct?: AdminProductDetailDto;
  selectedProductId?: number;

  constructor(private http: AdminProductHttp, private router: Router) { }

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
    console.log(this.selectedProduct);
  }

  onSearch() {
    this.page = 1;
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;

    this.http
      .getProductList(
        this.page,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
        this.searchTerm,
      )
      .subscribe({
        next: (res) => {
          this.products = res.items ?? [];
          this.totalPages = res.totalPages;
          this.hasNext = res.hasNext;
          this.hasPrevious = res.hasPrevious;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('GET /products ERROR:', err);
          this.isLoading = false;
        }
      });
  }

  applySort(column: string): void {
    if (this.sortBy === column) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }

    this.sortLabel = this.getSortLabel(column, this.sortDirection);
    this.page = 1; // reset pagination
    this.loadProducts();
  }

  private getSortLabel(
    column: string,
    direction: 'asc' | 'desc'
  ): string {
    const arrow = direction === 'asc' ? '↑' : '↓';

    switch (column) {
      case 'name':
        return `Name ${arrow}`;
      case 'price':
        return `Price ${arrow}`;
      case 'category':
        return `Category ${arrow}`;
      case 'parentcategory':
        return `Parent Category ${arrow}`;
      case 'modifieddate':
        return `Modified Date ${arrow}`; 
      default:
        return `ID ${arrow}`;
    }
  }

  selectProduct(productId: number) {
    if (this.selectedProductId === productId) {
      this.selectedProductId = undefined;
      this.selectedProduct = undefined;
      return;
    }

    this.http.getProductDetail(productId).subscribe((detail) => {
      this.selectedProductId = productId;
      this.selectedProduct = detail;
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
