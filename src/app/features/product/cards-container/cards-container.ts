import { Component, OnInit, inject } from '@angular/core'; 
import { ViewportScroller } from '@angular/common';        
import { ProductHttp } from '../../../shared/services/product-http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // <--- Import aggiunto
import { Page } from '../../../shared/models/Page';
import { ProductCard } from '../../../shared/models/ProductCard';
import { Category } from '../../../shared/models/Category ';
import { Card } from './card/card';
import { SubCategorySelection } from '../sub-category-selection/sub-category-selection';

@Component({
  selector: 'app-cards-container',
  standalone: true, // Aggiunto standalone true per coerenza con gli imports
  imports: [CommonModule, Card, SubCategorySelection],
  templateUrl: './cards-container.html',
  styleUrls: ['./cards-container.css'],
})
export class CardsContainer implements OnInit {
  
  private viewportScroller = inject(ViewportScroller);

  pagedData: Page<ProductCard> | null = null;
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  loading = false;

  constructor(
    private http: ProductHttp,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.LoadCategories();

    // Ascolta i parametri della rotta per filtrare all'avvio o al cambio URL
    this.route.queryParams.subscribe(params => {
      const categoryIdParam = params['categoryId'];
      
      if (categoryIdParam) {
        // Se c'è il parametro, convertilo e carica
        this.selectedCategoryId = +categoryIdParam;
        this.GetProducts(1, this.selectedCategoryId);
      } else {
        // Se non c'è, carica tutto (o resetta se stavi filtrando)
        this.selectedCategoryId = null;
        this.GetProducts(1, null);
      }
    });
  }

  LoadCategories(): void {
    this.http.GetCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Errore caricamento categorie:', err);
      }
    });
  }

  GetProducts(pageNumber: number = 1, categoryId: number | null = null): void {
    // SCROLL VERSO L'ALTO 
    this.viewportScroller.scrollToPosition([0, 0]); 

    this.loading = true;

    this.http.GetProductP(pageNumber, categoryId ?? undefined).subscribe({
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

  // quando figlio cambia categoria (selezione manuale dal menu laterale)
  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.GetProducts(1, categoryId); 
    
  }
}
