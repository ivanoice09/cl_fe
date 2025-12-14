import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main-categories-bar',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './main-categories-bar.html',
  styleUrl: './main-categories-bar.scss',
})
export class MainCategoriesBar {
  links = [
    { label: 'BIKES', path: '/products/bikes' },
    { label: 'COMPONENTS', path: 'products/components' },
    { label: 'CLOTHING', path: 'products/clothing' },
    { label: 'ACCESSORIES', path: 'products/accessories' }
  ];

  // evento per comunicare al padre
  // @Output() toggle = new EventEmitter<void>();

  // funzione chiamata dal button
  // toggleMenu() {
  //   this.toggle.emit();
  // }
}
