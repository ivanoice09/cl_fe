export interface AdminProductCreateDto {
  // General
  parentCategoryId: number;
  productCategoryId: number;
  productModelId: number | null;
  productNumber: string;
  name: string;

  // Pricing
  listPrice: number;
  standardCost: number;

  // Attributes
  color?: string | null;
  size?: string | null;
  weight?: number | null;

  // Availability
  sellStartDate: string;       // ISO string
  sellEndDate?: string | null;
  discontinuedDate?: string | null;
}