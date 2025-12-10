import { Component, OnInit } from '@angular/core';
import { AddressHttp } from '../../../shared/services/address-http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addresses.html',
  styleUrl: './addresses.css',
})
export class Addresses implements OnInit {
  addresses: any[] = [];
  loading = true;

  isCreating = false;
  isEditing: number | null = null;

  @Input() startWithCreate: boolean = false;

  newAddress = {
    addressLine1: '',
    city: '',
    stateProvince: '',
    countryRegion: '',
    postalCode: '',
    addressType: 'Home',
  };

  editAddress = {
    addressId: 0,
    addressLine1: '',
    city: '',
    postalCode: '',
    countryRegion: '',
    stateProvince: '',
    addressType: 'Home',
  };

  constructor(private addressHttp: AddressHttp) {}

  ngOnInit(): void {
  this.loadAddresses();

  // Se richiesto dal parent, apre subito il form di creazione
  if (this.startWithCreate) {
    this.isCreating = true;
  }
}

  loadAddresses() {
    this.addressHttp.getMyAddresses().subscribe({
      next: (list) => {
        this.addresses = list;
        this.loading = false;
      },
      error: (err) => console.error(err),
    });
  }

  createAddress() {
    this.addressHttp.createAddress(this.newAddress).subscribe({
      next: () => {
        this.isCreating = false;
        this.loadAddresses();
      },
      error: (err) => console.error(err),
    });
  }

  startEdit(a: any) {
    this.isEditing = a.addressId;
    this.editAddress = {
      addressId: a.addressId,
      addressLine1: a.addressLine1,
      city: a.city,
      postalCode: a.postalCode,
      addressType: a.addressType,
      countryRegion: a.countryRegion,
      stateProvince: a.stateProvince,
    };
  }

  saveEdit(id: number) {
    this.addressHttp.updateAddress(id, this.editAddress).subscribe({
      next: () => {
        this.isEditing = null;
        this.loadAddresses();
      },
      error: (err) => console.error(err),
    });
  }

  deleteAddress(id: number) {
    if (!confirm('Sei sicuro di voler eliminare questo indirizzo?')) return;

    this.addressHttp.deleteAddress(id).subscribe({
      next: () => this.loadAddresses(),
      error: (err) => console.error(err),
    });
  }
}
