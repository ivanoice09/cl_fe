// File: detail.component.ts

import { Component } from '@angular/core';
import { ProductDetail } from '../../../../../shared/models/ProductDetail';
import { ActivatedRoute } from '@angular/router';
import { ProductHttp } from '../../../../../shared/services/product-http';
import { CurrencyPipe, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail',
  imports: [DatePipe, CurrencyPipe, CommonModule, FormsModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail {
  product!: ProductDetail;
  
  selectedLanguage: string = 'en';
  
  availableLanguages: string[] = [];
  
  languageNames: { [key: string]: string } = {
   'ar': 'Arabic',
    'en': 'English',
    'fr': 'French',
    'he': 'Hebrew',
    'th': 'Thai',
    'zh-cht': 'Chinese'
  };

  constructor(private route: ActivatedRoute, private http: ProductHttp) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.GetProductDetail(id).subscribe({
      next: (res) => {
        this.product = res;
        
        //  le lingue disponibili per questo prodotto
        this.availableLanguages = Object.keys(res.descriptions);
        
        //  lingua di default se disponibile
        if (this.availableLanguages.length > 0) {
          // Prova inglese, altrimenti prima disponibile
          this.selectedLanguage = this.availableLanguages.includes('en') 
            ? 'en' 
            : this.availableLanguages[0];
        }
      },
      error: (err) => {
        console.error('Errore caricamento prodotto:', err);
      },
    });
  }

  
  get currentDescription(): string {
    if (!this.product || !this.product.descriptions) {
      return 'Nessuna descrizione disponibile.';
    }
    
    return this.product.descriptions[this.selectedLanguage] 
      || this.product.descriptions['en'] 
      || 'Descrizione non disponibile in questa lingua.';
  }

  
  getLanguageName(code: string): string {
    return this.languageNames[code] || code.toUpperCase();
  }
}
