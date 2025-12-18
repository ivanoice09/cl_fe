import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart-service';
import { CartResponse, CartItem } from '../../shared/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit {
  cart: CartResponse | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cartService.getMyCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore caricamento carrello:', err);
        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage = 'Devi effettuare il login per visualizzare il carrello';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMessage = 'Errore nel caricamento del carrello';
        }
      },
    });
  }

  // Calcola totale item
  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  //  Calcola totale carrello
  getTotalAmount(): number {
    if (!this.cart?.items) return 0;
    return this.cart.items.reduce((sum, item) => sum + this.getItemTotal(item), 0);
  }

  // Calcola numero totale items
  getTotalItems(): number {
    if (!this.cart?.items) return 0;
    return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  trackByCartItemId(_: number, item: CartItem): string | number {
    return item.cartItemId;
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    const qty = Number(newQuantity);
    if (qty < 1) return;

    this.cartService.updateCartItem(item.cartItemId, qty).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart;
      },
      error: (err) => {
        alert("Errore durante l'aggiornamento della quantità");
      },
    });
  }

  incrementQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  removeItem(item: CartItem): void {
    if (confirm(`Rimuovere "${item.productName}" dal carrello?`)) {
      this.cartService.removeFromCart(item.cartItemId).subscribe({
        next: (updatedCart) => {
          this.cart = updatedCart;
        },
        error: (err) => {
          alert("Errore durante la rimozione dell'item");
        },
      });
    }
  }

  clearCart(): void {
    if (confirm('Sei sicuro di voler svuotare il carrello?')) {
      this.cartService.clearCart().subscribe({
        next: (emptyCart) => {
          this.cart = emptyCart;
        },
        error: (err) => {
          alert('Errore durante lo svuotamento del carrello');
        },
      });
    }
  }

  proceedToCheckout(): void {
    if (!this.cart || this.cart.items.length === 0) {
      alert('Il carrello è vuoto');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
