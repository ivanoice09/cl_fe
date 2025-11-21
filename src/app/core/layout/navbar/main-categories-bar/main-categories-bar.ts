import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main-categories-bar',
  imports: [RouterLink, CommonModule],
  templateUrl: './main-categories-bar.html',
  styleUrl: './main-categories-bar.scss',
})
export class MainCategoriesBar {
  links = [
    { label: 'BIKES', path: '/bikes' },
    { label: 'COMPONENT', path: '/component' },
    { label: 'CLOTHING', path: '/clothing' },
    { label: 'ACCESSORIES', path: '/accessories' }
  ];

  // evento per comunicare al padre
  @Output() toggle = new EventEmitter<void>();

  // funzione chiamata dal button
  toggleMenu() {
    this.toggle.emit();
  }
}
