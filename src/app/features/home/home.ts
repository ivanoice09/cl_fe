import { Component } from '@angular/core';
import { HighlightSection } from './highlight-section/highlight-section';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HighlightSection,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
