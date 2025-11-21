// File: shared/models/Category.ts

export class Category {
  constructor(
    public categoryId: number,
    public name: string,
    public productCount: number
  ) {}
}
