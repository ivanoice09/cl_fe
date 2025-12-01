import { Component, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductHttp } from '../../shared/services/product-http';
import { ProductCard } from '../../shared/models/ProductCard';
import { Card } from '../product/cards-container/card/card';

declare var bootstrap: any;

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, Card],
  providers: [ProductHttp],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
})
export class SearchBar implements AfterViewInit {
  // Generatore di ID univoci statico
  static globalCounter = 0;
  // ID univoco per questa specifica istanza del componente
  uniqueId: string = '';

  searchText: string = '';
  products: ProductCard[] = [];
  filteredProducts: ProductCard[] = [];
  slider: any;
  minPrice: number = 0;
  maxPrice: number = 5000;
  filtersActive: boolean = false;
  
  private modalInstance: any;

  constructor(
    private productHttp: ProductHttp,
    private router: Router
  ) {
    // Assegna un ID univoco alla creazione (es. searchModal-1, searchModal-2)
    SearchBar.globalCounter++;
    this.uniqueId = `searchModal-${SearchBar.globalCounter}`;
  }

  ngAfterViewInit(): void {
    // Usa l'ID univoco per trovare la modale corretta
    const modalElement = document.getElementById(this.uniqueId);
    if (modalElement) {
      modalElement.addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

      modalElement.addEventListener('hidden.bs.modal', () => {
        this.closeFilters();
        // Trova il pulsante brand DENTRO questo componente specifico o vicino
        // (Semplificazione: il focus torna al body se non specificato, ma evita errori)
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Cerchiamo il container specifico di QUESTA istanza
    // Nota: Se ci sono più search bar, questo selettore generico potrebbe chiuderle tutte,
    // ma va bene per il comportamento dropdown.
    const searchContainer = target.closest('.search-dropdown-container');
    
    // Se il click non è dentro un search container, chiudi
    if (!searchContainer) {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.products = [];
  }

  goToProduct(productId: number): void {
    this.closeDropdown();
    this.searchText = '';
    this.router.navigate(['product', productId]);
  }

  goToProductAndCloseModal(productId: number): void {
    this.closeModalSafely();
    this.searchText = '';
    setTimeout(() => {
      this.router.navigate(['product', productId]);
    }, 300);
  }

  onSearchBase(): void {
    if (this.filtersActive) {
      return;
    }
    if (!this.searchText.trim()) {
      this.products = [];
      return;
    }
    this.productHttp
      .SearchProduct(this.searchText, this.minPrice, this.maxPrice)
      .subscribe((result) => {
        this.products = result.items;
      });
  }

  onSearchAdvance(): void {
    if (!this.filtersActive) {
      return;
    }
    
    this.productHttp
      .SearchProduct(this.searchText, this.minPrice, this.maxPrice)
      .subscribe((result) => {
        this.filteredProducts = result.items.slice(0, 10);
      });
  }

  openFilters(): void {
    this.filtersActive = true;
    this.products = [];
    this.onSearchAdvance();
  }

  closeFilters(): void {
    this.filtersActive = false;
    this.filteredProducts = [];
  }

  private closeModalSafely(): void {
    // Usa l'ID univoco
    const modalElement = document.getElementById(this.uniqueId);
    if (modalElement) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  closeModalButton(): void {
    this.closeModalSafely();
  }

  resetFilters(): void {
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.onSearchAdvance();
  }

  trackByProductId(index: number, item: ProductCard): number {
    return item.productId;
  }
}