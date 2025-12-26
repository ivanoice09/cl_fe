export interface ProductDetailDto {
    productId: number;
    // General:
    productCategoryId: number;
    productModelId: number;
    productNumber: string;
    name: string;
    // Pricing
    listPrice: number;
    standardCost: number;
    // Attributes
    color: string;
    size: number;
    weight: number;
    // Availability
    sellStartDate: string;
    sellEndDate: string;
    discontinuedDate: string;
}