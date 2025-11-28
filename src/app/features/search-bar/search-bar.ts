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
  ) {}

  // ✅ NUOVO: Inizializza gli eventi della modale
  ngAfterViewInit(): void {
    const modalElement = document.getElementById('searchModal');
    if (modalElement) {
      // Ascolta l'evento di chiusura della modale
      modalElement.addEventListener('hide.bs.modal', () => {
        // Rimuove il focus dagli elementi interni prima della chiusura
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

      // Ascolta quando la modale è completamente chiusa
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.closeFilters();
        // Sposta il focus al pulsante "Filtri Avanzati" per migliorare UX
        const filterButton = document.querySelector('.btn-brand') as HTMLElement;
        if (filterButton) {
          filterButton.focus();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const searchContainer = document.querySelector('.search-dropdown-container');
    
    if (searchContainer && !searchContainer.contains(target)) {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.products = [];
  }

  goToProduct(productId: number): void {
    this.closeDropdown();
    this.router.navigate(['product', productId]);
  }

  goToProductAndCloseModal(productId: number): void {
    this.closeModalSafely();
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

  // ✅ MODIFICATO: Chiude la modale in modo sicuro per accessibilità
  private closeModalSafely(): void {
    const modalElement = document.getElementById('searchModal');
    if (modalElement) {
      // Rimuove il focus prima di chiudere
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  // ✅ NUOVO: Metodo pubblico per chiudere la modale (chiamato dai pulsanti)
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
