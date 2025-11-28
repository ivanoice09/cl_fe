import { Component, HostListener } from '@angular/core';
import { MainCategoriesBar } from './main-categories-bar/main-categories-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../shared/services/auth';
import { SearchBar } from '../../../features/search-bar/search-bar';


@Component({
  selector: 'app-navbar',
  imports: [MainCategoriesBar, RouterLink, CommonModule, SearchBar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  // Costrutto per implementare il logout
  constructor(private router: Router, public auth: Auth) {}

  showHamburgerMenu = false;
  childLinks = [
    { label: 'BIKES', path: '/bikes' },
    { label: 'COMPONENT', path: '/component' },
    { label: 'CLOTHING', path: '/clothing' },
    { label: 'ACCESSORIES', path: '/accessories' },
  ];

  showUserMenu = false;
  
  // Ver 2: L'hover avviene solo quando l'user è loggato
  onHover(state: boolean) {
    if (!this.auth.GetLoginStatus()) return;
    this.showUserMenu = state;
  }

  // Ver 3: Metto delay, perché il dropdown si chiude subito
  private hideTimeout: any;

  showMenuNow(state: boolean) {
    if (!this.auth.GetLoginStatus()) return;
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

  logout() {
    // console.log('Logout...');

    // Implemento il logout
    this.auth.SetJwtInfo(false, '');
    this.router.navigate(['/home']);
    console.log('logout successful');
  }
}
