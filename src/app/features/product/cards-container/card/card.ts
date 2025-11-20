import { Component, Input } from '@angular/core';
import { ProductCard } from '../../../../shared/models/ProductCard';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() product!: ProductCard;
}