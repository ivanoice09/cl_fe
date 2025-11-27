import { Component, OnInit } from '@angular/core';
import { CustomerHttp } from '../../shared/services/customer-http';
import { CommonModule } from '@angular/common'; 
import { CustomerProfile } from '../../shared/models/CustomerProfile';
import { AddressCustomer } from '../../shared/models/AddressCustomer';
import { OrderCustomer } from '../../shared/models/OrderCustomer';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
 profile: CustomerProfile | null = null;
  loading = true;

  constructor(private customerHttp: CustomerHttp) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.customerHttp.getCustomerProfile().subscribe({
      next: (dto) => {
        // Trasforma JSON in classi DTO usando map
        
        const addresses = dto.addresses.map(a => 
          new AddressCustomer(a.addressId, a.addressLine1, a.city, a.postalCode)
        );

        const orders = dto.orders.map(o => 
          new OrderCustomer(o.salesOrderId, o.salesOrderNumber, o.orderDate, o.totalDue, o.status)
        );

        this.profile = new CustomerProfile(
          dto.customerId,
          dto.firstName,
          dto.lastName,
          dto.emailAddress,
          dto.phone,
          addresses,
          orders
        );

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}