import { Component, OnInit } from '@angular/core';
import { ProductHttp } from '../../../shared/services/product-http';
import { CommonModule } from '@angular/common';
import { Page } from '../../../shared/models/Page';
import { ProductCard } from '../../../shared/models/ProductCard';
import { Card } from './card/card';

@Component({
  selector: 'app-cards-container',
  imports: [CommonModule, Card],
  templateUrl: './cards-container.html',
  styleUrls: ['./cards-container.css'],
})
export class CardsContainer {
  pagedData: Page<ProductCard> | null = null;

  constructor(private http: ProductHttp) {
    this.GetProducts();
  }

  GetProducts(pageNumber: number = 1) {
    this.http.GetProductP(pageNumber).subscribe({
      next: (response) => {
        const items = response.items.map(
          (item: any) =>
            new ProductCard(
              item.productId,
              item.name,
              item.listPrice,
              item.productCategoryId,
              item.categoryName,
              item.thumbNailPhoto
            )
        );
        this.pagedData = new Page<ProductCard>(
          response.currentPage,
          response.pageSize,
          response.totalItems,
          response.totalPages,
          response.hasPrevious,
          response.hasNext,
          items
        );
      },
      error: (err) => {
        console.error('Errore:', err);
      },
    });
  }
}
