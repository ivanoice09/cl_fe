
export class OrderCustomer {
  constructor(
    public salesOrderId: number,
    public salesOrderNumber: string,
    public orderDate: Date,
    public totalDue: number,
    public status: string
  ) {}
}
