import { Component, HostListener } from '@angular/core';
import {MainCategoriesBar} from './main-categories-bar/main-categories-bar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [MainCategoriesBar, RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  showHamburgerMenu = false;
  childLinks = [
    { label: 'BIKES', path: '/bikes' },
    { label: 'COMPONENT', path: '/component' },
    { label: 'CLOTHING', path: '/clothing' },
    { label: 'ACCESSORIES', path: '/accessories' }
  ];

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
