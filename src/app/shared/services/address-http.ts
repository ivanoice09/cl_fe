import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address, AddressCreate, AddressUpdate } from '../models/ProfileAddress';

@Injectable({
  providedIn: 'root',
})
export class AddressHttp {

  private apiUrl = 'https://localhost:7000/api/Addresses';

  constructor(private http: HttpClient) { }

  getMyAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl);
  }

  // getAddress(id: number): Observable<Address> {
  //   return this.http.get<Address>(`${this.apiUrl}/${id}`);
  // }

  createAddress(dto: AddressCreate): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  updateAddress(id: number, dto: AddressUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}
