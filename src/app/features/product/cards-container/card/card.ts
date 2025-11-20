import { Component, Input } from '@angular/core';
import { ProductCard } from '../../../../shared/models/ProductCard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() product!: ProductCard;


  constructor(private router: Router) {}

  onSelect() {
    this.router.navigate(['/product', this.product.productId]);
  }
}
