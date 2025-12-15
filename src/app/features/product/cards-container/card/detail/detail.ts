// detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductDetail } from '../../../../../shared/models/ProductDetail';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductHttp } from '../../../../../shared/services/product-http';
import { CurrencyPipe, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail',
  standalone: true,
  // ❌ Router non va qui
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

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: ProductHttp,
    private router: Router // ✅ qui è giusto
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idString = params.get('id');

      if (!idString) {
        this.navigateTo404();
        return;
      }

      const idNumber = Number(idString);

      if (
        !Number.isInteger(idNumber) ||
        idNumber <= 0 ||
        idNumber > 2_147_483_647
      ) {
        this.navigateTo404();
        return;
      }

      this.loadProductData(idNumber);
    });
  }

  private navigateTo404() {
    this.router.navigate(['/404'], { skipLocationChange: true });
  }

  loadProductData(id: number) {
    this.http.GetProductDetail(id).subscribe({
      next: (res) => {
        this.product = res;

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
