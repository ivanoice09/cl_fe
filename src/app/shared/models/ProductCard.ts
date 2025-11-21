export class ProductCard {
  constructor(
    public productId: number,
    public name: string,
    public listPrice: number,
    public productCategoryId: number,
    public categoryName: string,
    public thumbNailPhoto: string
  
  ) {}
}
