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
  @Output() categoryChange = new EventEmitter<number | null>();

  selectCategory(categoryId: number | null): void {
    this.categoryChange.emit(categoryId);
  }
  showAll = false;

  // =categorie ordinate per numero prodotti
  get sortedCategories(): Category[] {
    return [...this.categories].sort((a, b) => b.productCount - a.productCount);
  }

  // categorie da visualizzare=
  get visibleCategories(): Category[] {
    return this.showAll ? this.sortedCategories : this.sortedCategories.slice(0, 5);
  }

  //  ci sono altre categorie da mostrare?
  get hasMoreCategories(): boolean {
    return this.categories.length > 5;
  }

  // mostra tutto
  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }
}
