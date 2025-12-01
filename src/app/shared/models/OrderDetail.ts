
export class OrderDetail {
  constructor(
    public salesOrderId: number,
    public salesOrderNumber: string,
    public orderDate: string,
    public shipDate: string,
    public status: number,
    public shipMethod: string,
    public subTotal: number,
    public taxAmt: number,
    public freight: number,
    public totalDue: number,
    public billToAddress: any,
    public shipToAddress: any,
    public items: OrderDetailItem[]
  ) {}
}

export class OrderDetailItem {
  constructor(
    public productId: number,
    public productName: string,
    public orderQty: number,
    public unitPrice: number,
    public lineTotal: number
  ) {}
}