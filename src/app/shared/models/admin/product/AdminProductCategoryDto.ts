export interface AdminCategoryDto {
  productCategoryId: number;
  name: string;
  parentProductCategoryId: number | null;
}