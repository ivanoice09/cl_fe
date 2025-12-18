import { AddressCustomer } from './AddressCustomer';

export interface CustomerDetail {
  customerId: number;
  firstName: string;
  lastName: string;
  emailAddress?: string;
  phone?: string;
  addresses: AddressCustomer[];
}
