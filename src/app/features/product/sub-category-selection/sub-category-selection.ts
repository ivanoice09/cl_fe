import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../shared/models/Category ';

@Component({
  selector: 'app-sub-category-selection',
  imports: [CommonModule],
  templateUrl: './sub-category-selection.html',
  styleUrl: './sub-category-selection.css',
})
export class SubCategorySelection {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId: number | null = null;

  // Nascondo il bottone "Tutte le categorie"
  @Input() showAllButton = true;

  @Output() categoryChange = new EventEmitter<number | null>();

  selectCategory(categoryId: number | null): void {
    this.categoryChange.emit(categoryId);
  }
  showAll = false;

  get sortedCategories(): Category[] {
    // 1. Filtra l'array per escludere le categorie con productCount === 0
    const filteredCategories = this.categories.filter((category) => category.productCount > 0);

    // 2. Ordina l'array filtrato per numero prodotti (decrescente)
    return [...filteredCategories].sort((a, b) => b.productCount - a.productCount);
  }

  get visibleCategories(): Category[] {
    return this.showAll ? this.sortedCategories : this.sortedCategories.slice(0, 5);
  }

  get hasMoreCategories(): boolean {
    return this.sortedCategories.length > 5;
  }

  // mostra tutto
  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }
}
