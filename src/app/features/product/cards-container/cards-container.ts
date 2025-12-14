
import { Component, OnInit, inject } from '@angular/core'; 
import { ViewportScroller } from '@angular/common';        
import { ProductHttp } from '../../../shared/services/product-http';
import { CommonModule } from '@angular/common';
import { Page } from '../../../shared/models/Page';
import { ProductCard } from '../../../shared/models/ProductCard';
import { Category } from '../../../shared/models/Category ';
import { Card } from './card/card';
import { SubCategorySelection } from '../sub-category-selection/sub-category-selection';
import { MainCategory } from '../../../shared/models/MainCategory';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cards-container',
  imports: [CommonModule, Card, SubCategorySelection],
  templateUrl: './cards-container.html',
  styleUrls: ['./cards-container.css'],
})
export class CardsContainer implements OnInit {
  
  private viewportScroller = inject(ViewportScroller);

  pagedData: Page<ProductCard> | null = null;
  categories: Category[] = [];

  // 1 per far funzionare la categorizzazione dei prodotti
  selectedMainCategory: MainCategory | null = null;

  selectedCategoryId: number | null = null;
  loading = false;

  constructor(private http: ProductHttp, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const mainCategory = params.get('mainCategory') as MainCategory | null;

      this.selectedMainCategory = mainCategory;
      this.selectedCategoryId = null;

      this.LoadCategories();
      // this.GetProducts(1, null);
    });
  }

  get mainCategoryLabel(): string | null {
    if (!this.selectedMainCategory) return null;
    return this.selectedMainCategory.charAt(0).toUpperCase() + this.selectedMainCategory.slice(1);
  }

  // Se incaso un main category non abbia nessun prodotto
  get isEmpty(): boolean {
    return !!this.pagedData && this.pagedData.totalItems === 0;
  }

  // LoadCategories(): void {
  //   this.http.GetCategories().subscribe({
  //     next: (categories) => {
  //       this.categories = categories;
  //     },
  //     error: (err) => {
  //       console.error('Errore caricamento categorie:', err);
  //     }
  //   });
  // }

  LoadCategories(): void {
    this.http.GetCategories(this.selectedMainCategory).subscribe({
      next: categories => {
        this.categories = categories;

        // If we are inside a main category and no sub-category is selected yet
        if (this.selectedMainCategory && categories.length > 0 && this.selectedCategoryId === null) {
          const firstCategory = categories[0];
          this.selectedCategoryId = firstCategory.categoryId;
          this.GetProducts(1, firstCategory.categoryId, this.selectedMainCategory);
        }

      }, 
      error: err => console.error(err)
    });
  }

  GetProducts(
    pageNumber: number = 1, 
    categoryId: number | null = null,
    // Aggiungo questo per individuare i main category
    mainCategory: MainCategory | null = null
  ): void {
    // SCROLL VERSO L'ALTO 
    this.viewportScroller.scrollToPosition([0, 0]); 

    this.loading = true;

    this.http.GetProductP(pageNumber, categoryId ?? undefined, mainCategory).subscribe({
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

        this.pagedData = new Page(
          response.currentPage,
          response.pageSize,
          response.totalItems,
          response.totalPages,
          response.hasPrevious,
          response.hasNext,
          items
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore:', err);
        this.loading = false;
      },
    });
  }

  // quando figlio cambia categoria
  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.GetProducts(1, categoryId); 
  }
}
