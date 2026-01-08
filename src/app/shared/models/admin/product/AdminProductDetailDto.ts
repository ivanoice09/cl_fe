export interface AdminProductDetailDto {
    productId: number;

    // General:
    productParentCategoryName: string;
    productCategoryName: string;
    productModelName: string;
    productNumber: string;
    name: string;

    // Pricing:
    standardCost: number;
    listPrice: number;

    // Attributes:
    color?: string;
    size?: string;
    weight?: number;

    // Availability:
    sellStartDate: string;
    sellEndDate?: string;
    discontinuedDate?: string;
}