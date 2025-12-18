import { Component, OnInit, OnDestroy } from '@angular/core';
import { HighlightSection } from './highlight-section/highlight-section';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [HighlightSection,RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  slides = [
    {
      title: 'Benvenuti nel nostro Store',
      text: 'Scopri i migliori prodotti, le novità e le categorie più popolari',
      image: './assets/images/main-banner.jpg'
    },
    {
      title: 'Nuova Collezione 2025',
      text: 'Esplora il design moderno e la qualità senza compromessi',
      image: './assets/images/main-banner2.png' // Assicurati che esistano queste immagini
    },
    {
      title: 'Offerte Esclusive',
      text: 'Sconti fino al 50% su prodotti selezionati per questa settimana',
      image: './assets/images/main-banner3.png'
    }
  ];

  currentSlide = 0;
  intervalId: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    // Importante pulire il timer quando l'utente cambia pagina
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambio ogni 5 secondi
  }


isAnimating = true; // Gestisce l'attivazione della classe CSS


nextSlide() {
  this.isAnimating = false; // Rimuove la classe per un istante
  
  setTimeout(() => {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.isAnimating = true; // Riapplica la classe per far ripartire l'animazione
  }, 50); // Piccolo ritardo per permettere al DOM di reagire
}

// Utile se l'utente clicca sui puntini
goToSlide(index: number) {
  if (this.currentSlide === index) return;
  this.isAnimating = false;
  
  setTimeout(() => {
    this.currentSlide = index;
    this.isAnimating = true;
  }, 50);
}
}
