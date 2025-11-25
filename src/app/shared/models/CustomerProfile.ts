import { AddressCustomer } from './AddressCustomer';
import { OrderCustomer } from './OrderCustomer';

export class CustomerProfile {
  constructor(
    public customerId: number,
    public firstName: string,
    public lastName: string,
    public emailAddress: string,
    public phone: string,
    public addresses: AddressCustomer[],
    public orders: OrderCustomer[]
  ) {}
}
