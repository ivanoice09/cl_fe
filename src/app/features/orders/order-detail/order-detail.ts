import { Component, OnInit } from '@angular/core';
import { OrderHttp } from '../../../shared/services/order-http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderDetail } from '../../../shared/models/OrderDetail';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.css'],
})
export class OrderDetailComponent implements OnInit {

  orderId!: number;
  orderDetail: OrderDetail | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrderHttp
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.loadOrderDetail();
  }

  loadOrderDetail() {
    this.ordersService.getOrderDetail(this.orderId).subscribe({
      next: (detail) => {
        this.orderDetail = detail;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
}
