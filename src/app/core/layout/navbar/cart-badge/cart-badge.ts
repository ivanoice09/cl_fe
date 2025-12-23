import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../../../shared/services/cart-service';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-badge.html',
  styleUrls: ['./cart-badge.css']
})
export class CartBadgeComponent implements OnInit, OnDestroy {
  cartCount: number = 0;
  private cartCountSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartCountSubscription = this.cartService.cartCount$.subscribe({
      next: (count) => {
        this.cartCount = count;
      },
      error: (err) => {
        console.error('Errore nella sottoscrizione al contatore carrello:', err);
        this.cartCount = 0;
      }
    });
  }

  ngOnDestroy(): void {
    this.cartCountSubscription?.unsubscribe();
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
}
