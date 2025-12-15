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

  onMouseMove(event: MouseEvent) {
    const link = event.currentTarget as HTMLElement;
    const label = link.querySelector('.label') as HTMLElement;

    const rect = label.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    label.style.setProperty('--x', `${x}px`);
    label.style.setProperty('--y', `${y}px`);
  }

  onMouseLeave(event: MouseEvent) {
    const link = event.currentTarget as HTMLElement;
    const label = link.querySelector('.label') as HTMLElement;

    label.style.removeProperty('--x');
    label.style.removeProperty('--y');
  }

  // evento per comunicare al padre
  // @Output() toggle = new EventEmitter<void>();

  // funzione chiamata dal button
  // toggleMenu() {
  //   this.toggle.emit();
  // }
}
