export class Review {
  constructor(
    public id: string,
    public productId: number,
    public customerId: number,
    public rating: number,
    public text: string,
    public userName: string,
    public createdAt: string
  ) {}
}

export class ProductDetail {
  constructor(
    public productId: number,
    public name: string,
    public color: string | null,
    public listPrice: number,
    public productCategoryId: number,
    public categoryName: string,
    public thumbNailPhoto: string,
    public size: string | null,
    public weight: number | null,
    public productNumber: string,
    public reviews: Review[],
    public descriptions: { [key: string]: string }
  ) {}
}
