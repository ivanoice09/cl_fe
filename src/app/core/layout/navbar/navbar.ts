import { Component, HostListener } from '@angular/core';
import { MainCategoriesBar } from './main-categories-bar/main-categories-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth-service';
import { SearchBar } from '../../../features/search-bar/search-bar';
import { AlertService } from '../../../shared/services/alert-service';
import { CartBadgeComponent } from '../navbar/cart-badge/cart-badge';

@Component({
  selector: 'app-navbar',
  imports: [MainCategoriesBar, RouterLink, CommonModule, SearchBar, CartBadgeComponent],
templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  isLogged = false;
  userEmail: string | null = null;

  showHamburgerMenu = false;
  showUserMenu = false;

  childLinks = [
    { label: 'BIKES', path: '/bikes' },
    { label: 'COMPONENT', path: '/component' },
    { label: 'CLOTHING', path: '/clothing' },
    { label: 'ACCESSORIES', path: '/accessories' },
  ];
  
  // Costrutto per implementare il logout
  constructor(private router: Router, public authService: AuthService, private alertService: AlertService) {}

  ngOnInit() {
    // Subscribe to login updates
    this.authService.logged$.subscribe(v => this.isLogged = v);
    this.authService.email$.subscribe(e => this.userEmail = e);
  }

  logout() {
    this.authService.logoutBackend().subscribe(() => {

      this.alertService.showAlert('logged out successfully', 'success');
      
      this.router.navigate(['/login']);
      console.log('logout successful');
    });
  }

  // Hover behavior only when logged in
  private hideTimeout: any;

  showMenuNow(state: boolean) {
    if (!this.isLogged) return;
    clearTimeout(this.hideTimeout);
    this.showUserMenu = state;
  }

  hideMenuWithDelay() {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.showUserMenu = false;
    }, 1000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 727 && this.showHamburgerMenu) {
      this.showHamburgerMenu = false;
    }
  }

  toggleMenu() {
    this.showHamburgerMenu = !this.showHamburgerMenu;
  }

  
}
