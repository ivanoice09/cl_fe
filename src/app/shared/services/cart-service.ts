import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartResponse, CartItem, AddToCartDto, UpdateCartDto } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = 'https://localhost:7000/api/Carts';
  
  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  public cart$ = this.cartSubject.asObservable();
  
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.isAuthenticated()) {
      this.loadCart();
    }
  }

  private isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token && token.length > 0;
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Helper per calcolare totale items
  private calculateTotalItems(cart: CartResponse): number {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  loadCart(): void {
    if (!this.isAuthenticated()) {
      console.warn('Impossibile caricare il carrello: utente non autenticato');
      this.cartSubject.next(null);
      this.cartCountSubject.next(0);
      return;
    }

    this.http.get<CartResponse>(`${this.API_URL}/my-cart`, { 
      headers: this.getHeaders() 
    }).subscribe({
      next: (cart) => {
        this.cartSubject.next(cart);
        this.cartCountSubject.next(this.calculateTotalItems(cart)); 
      },
      error: (err) => {
        console.error('Errore caricamento carrello:', err);
        this.cartSubject.next(null);
        this.cartCountSubject.next(0);
      }
    });
  }

  getMyCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.API_URL}/my-cart`, {
      headers: this.getHeaders()
    }).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.cartCountSubject.next(this.calculateTotalItems(cart)); 
      })
    );
  }

  addToCart(productId: number, quantity: number): Observable<CartResponse> {
    const dto: AddToCartDto = { productId, quantity };
    
    return this.http.post<CartResponse>(`${this.API_URL}/items`, dto, {
      headers: this.getHeaders()
    }).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.cartCountSubject.next(this.calculateTotalItems(cart)); 
      })
    );
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<CartResponse> {
    const dto: UpdateCartDto = { quantity };
    
    return this.http.put<CartResponse>(`${this.API_URL}/items/${cartItemId}`, dto, {
      headers: this.getHeaders()
    }).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.cartCountSubject.next(this.calculateTotalItems(cart)); 
      })
    );
  }

  removeFromCart(cartItemId: number): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.API_URL}/items/${cartItemId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.cartCountSubject.next(this.calculateTotalItems(cart)); 
      })
    );
  }

  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.API_URL}/clear`, {
      headers: this.getHeaders()
    }).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.cartCountSubject.next(0); 
      })
    );
  }

  getCartTotal(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total`, {
      headers: this.getHeaders()
    });
  }

  getCartItemsCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/items/count`, {
      headers: this.getHeaders()
    }).pipe(
      tap(count => this.cartCountSubject.next(count))
    );
  }

  isProductInCart(productId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/products/${productId}/exists`, {
      headers: this.getHeaders()
    });
  }

  refreshCartAfterLogin(): void {
    this.loadCart();
  }

  clearCartOnLogout(): void {
    this.cartSubject.next(null);
    this.cartCountSubject.next(0);
  }
}
