export interface AdminCategory {
  productCategoryId: number;
  name: string;
  parentProductCategoryId: number | null;
}