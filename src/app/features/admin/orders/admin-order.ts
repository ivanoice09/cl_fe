import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AdminOrderHttp } from '../../../shared/services/admin/admin-order-http';
import { OrderList } from '../../../shared/models/OrderList';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-order',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-order.html',
  styleUrl: './admin-order.scss',
})
export class AdminOrder implements OnInit {
  ngOnInit() {
    this.loadOrders();
  }

  onSearch() {
    this.page = 1; // 4. Reset pagina a 1 quando si cerca
    this.loadOrders();
  }

  orders: OrderList[] = [];
  expandedOrderId: number | null = null;
  orderDetails: { [key: number]: any } = {};

  totalPages = 1;
  page = 1;
  pageSize = 10;
  searchTerm: string = '';
  hasNext = false;
  hasPrevious = false;

  constructor(private adminOrderHttp: AdminOrderHttp) {}

  loadOrders() {
    this.adminOrderHttp.getOrderList(this.page, this.pageSize, this.searchTerm).subscribe((res) => {
      this.orders = res.items;
      this.totalPages = res.totalPages;
      this.hasNext = res.hasNext;
      this.hasPrevious = res.hasPrevious;
      console.log('Risposta ricevuta orders:', res.items);
    });
  }

  deleteOrder(orderId: number) {
    this.adminOrderHttp.deleteOrder(orderId).subscribe({
      next: () => {
        console.log(`Ordine con ID ${orderId} eliminato con successo.`);
        window.location.reload();
      },
      error(err) {
        console.error("Errore durante l'eliminazione dell'ordine:", err);
        alert("Si è verificato un errore durante l'eliminazione dell'ordine.");
      },
    });
  }

  updateStatus(orderId: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = parseInt(selectElement.value, 10);

    if (confirm(`Sei sicuro di voler cambiare lo stato dell'ordine #${orderId}?`)) {
      // Nota: devi avere questo metodo patchStatus nell'adminOrderHttp
      this.adminOrderHttp.patchStatus(orderId, newStatus).subscribe({
        next: () => {
          console.log('Stato aggiornato con successo');
          // Aggiorniamo i dati locali senza ricaricare la pagina
          if (this.orderDetails[orderId]) {
            this.orderDetails[orderId].status = newStatus;
          }
          // Aggiorniamo anche nella lista principale se necessario
          const order = this.orders.find((o) => o.salesOrderId === orderId);
          if (order) this.loadOrders();
        },
        error: (err) => {
          console.error("Errore durante l'aggiornamento dello stato:", err);
          alert("Errore nell'aggiornamento dello stato.");
        },
      });
    }
  }

  toggleOrderDetails(orderId: number) {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;
      if (!this.orderDetails[orderId]) {
        this.adminOrderHttp.getOrderDetail(orderId).subscribe((details) => {
          this.orderDetails[orderId] = details;
        });
      }
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadOrders();
    }
  }
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadOrders();
    }
  }
}
