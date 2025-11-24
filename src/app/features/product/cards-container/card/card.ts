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

  onSelect(event: MouseEvent) {
    const selection = window.getSelection();
    // Se c'è del testo selezionato e la lunghezza > 0, NON navigare!
    if (selection && selection.toString().length > 0) {
      return; // Permetti selezione/copia, nessuna navigazione
    }
    // Altrimenti, esegui la navigazione
    this.router.navigate(['product', this.product.productId]);
  }
}
