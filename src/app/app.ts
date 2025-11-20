import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardsContainer } from './features/product/cards-container/cards-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CardsContainer],

  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('cl_fe');
}
