import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductHttp } from '../../../shared/services/product-http';
import { ProductCard } from '../../../shared/models/ProductCard';
import { Category } from '../../../shared/models/Category ';
import { Card } from '../../product/cards-container/card/card';

@Component({
  selector: 'app-highlight-section',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './highlight-section.html',
  styleUrl: './highlight-section.css',
})
export class HighlightSection implements OnInit {
  bestSellers: ProductCard[] = [];
  newArrivals: ProductCard[] = [];
  featuredCategories: Category[] = []; // Tutte le categorie, nessun slice

  currentBestSellerIndex = 0;
  currentNewArrivalIndex = 0;

  constructor(
    private productHttp: ProductHttp,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productHttp.GetBestSellers(20).subscribe((data) => (this.bestSellers = data));
    this.productHttp.GetNewArrivals(20).subscribe((data) => (this.newArrivals = data));
    this.productHttp.GetFeaturedCategories().subscribe((data) => (this.featuredCategories = data));
  }

  // NAVIGAZIONE BEST SELLERS
  nextBestSeller() {
    if (this.currentBestSellerIndex + 5 < this.bestSellers.length) {
      this.currentBestSellerIndex += 5;
    }
  }

  prevBestSeller() {
    if (this.currentBestSellerIndex - 5 >= 0) {
      this.currentBestSellerIndex -= 5;
    }
  }

  // NAVIGAZIONE NEW ARRIVALS
  nextNewArrival() {
    if (this.currentNewArrivalIndex + 5 < this.newArrivals.length) {
      this.currentNewArrivalIndex += 5;
    }
  }

  prevNewArrival() {
    if (this.currentNewArrivalIndex - 5 >= 0) {
      this.currentNewArrivalIndex -= 5;
    }
  }

  // VISIBLE ITEMS
  get visibleBestSellers() {
    return this.bestSellers.slice(this.currentBestSellerIndex, this.currentBestSellerIndex + 5);
  }

  get visibleNewArrivals() {
    return this.newArrivals.slice(this.currentNewArrivalIndex, this.currentNewArrivalIndex + 5);
  }

  get canGoPrevBestSeller() { return this.currentBestSellerIndex > 0; }
  get canGoNextBestSeller() { return this.currentBestSellerIndex + 5 < this.bestSellers.length; }
  
  get canGoPrevNewArrival() { return this.currentNewArrivalIndex > 0; }
  get canGoNextNewArrival() { return this.currentNewArrivalIndex + 5 < this.newArrivals.length; }

  onCategoryClick(category: Category) {
    // Naviga alla pagina prodotti filtrati per categoria
    this.router.navigate(['/products'], { queryParams: { categoryId: category.categoryId } });
  }

  // TRACK BY
  trackByProduct(index: number, product: ProductCard): number {
    return product.productId;
  }

  trackByCategory(index: number, category: Category): number {
    return category.categoryId;
  }
}
