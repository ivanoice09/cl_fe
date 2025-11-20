import { Component } from '@angular/core';
import { ProductDetail } from '../../../../../shared/models/ProductDetail';
import { ActivatedRoute } from '@angular/router';
import { ProductHttp } from '../../../../../shared/services/product-http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail',
  imports: [DatePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail {
  product!: ProductDetail;

  constructor(private route: ActivatedRoute, private http: ProductHttp) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.GetProductDetail(id).subscribe({
      next: (res) => {
        this.product = res;
      },
      error: (err) => {
        
      },
    });
  }
}
