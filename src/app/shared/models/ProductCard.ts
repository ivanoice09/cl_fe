export class ProductCard {
  constructor(
    public productId: number,
    public name: string,
    public color: string,
    public standardCost: number,
    public listPrice: number,
    public productCategoryId: number,
    public categoryName: string,
    public thumbNailPhoto: string
  ) {}
}
