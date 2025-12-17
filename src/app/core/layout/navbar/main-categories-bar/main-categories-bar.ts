import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/services/auth-service';

@Component({
  selector: 'app-main-categories-bar',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './main-categories-bar.html',
  styleUrl: './main-categories-bar.scss',
})
export class MainCategoriesBar {

  constructor(private authService: AuthService) {}

  shopLinks = [
    { label: 'BIKES', path: '/products/bikes' },
    { label: 'COMPONENTS', path: '/products/components' },
    { label: 'CLOTHING', path: '/products/clothing' },
    { label: 'ACCESSORIES', path: '/products/accessories' }
  ];

  adminLinks = [
    { label: 'CUSTOMERS', path: '/admin/customers' },
    { label: 'ORDERS', path: '/admin/orders' },
    { label: 'PRODUCTS', path: '/admin/products' }
  ];

  links = this.shopLinks;

  isAdmin = false;
  adminMode = false;

  ngOnInit(): void {
    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;

      if (!isAdmin) {
        this.adminMode = false;
        this.links = this.shopLinks;
      }
    })
  }

  toggleAdminMode(): void {
    this.adminMode = !this.adminMode;
    this.links = this.adminMode ? this.adminLinks : this.shopLinks;
  }
}
