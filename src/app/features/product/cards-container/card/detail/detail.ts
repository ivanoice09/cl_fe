// File: detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductDetail } from '../../../../../shared/models/ProductDetail';
import { ActivatedRoute } from '@angular/router';
import { ProductHttp } from '../../../../../shared/services/product-http';
import { CurrencyPipe, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, CommonModule, FormsModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit, OnDestroy {
  product!: ProductDetail;

  selectedLanguage: string = 'en';
  availableLanguages: string[] = [];

  languageNames: { [key: string]: string } = {
    ar: 'Arabic',
    en: 'English',
    fr: 'French',
    he: 'Hebrew',
    th: 'Thai',
    'zh-cht': 'Chinese',
  };

  // Subscription per gestire la pulizia della memoria
  private routeSub!: Subscription;

  constructor(private route: ActivatedRoute, private http: ProductHttp) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idString = params.get('id');
      if (idString) {
        const id = Number(idString);
        if (!isNaN(id)) {
          this.loadProductData(id);
        }
      }
    });
  }

  loadProductData(id: number) {
    this.http.GetProductDetail(id).subscribe({
      next: (res) => {
        this.product = res;

        // Imposta le lingue disponibili per questo prodotto
        if (res.descriptions) {
          this.availableLanguages = Object.keys(res.descriptions);
        } else {
          this.availableLanguages = [];
        }

        if (this.availableLanguages.length > 0) {
          this.selectedLanguage = this.availableLanguages.includes('en')
            ? 'en'
            : this.availableLanguages[0];
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('Errore caricamento prodotto:', err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  get currentDescription(): string {
    if (!this.product || !this.product.descriptions) {
      return 'Nessuna descrizione disponibile.';
    }

    return (
      this.product.descriptions[this.selectedLanguage] ||
      this.product.descriptions['en'] ||
      'Descrizione non disponibile in questa lingua.'
    );
  }

  getLanguageName(code: string): string {
    return this.languageNames[code] || code.toUpperCase();
  }
}
