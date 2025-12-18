export interface AdminProductEdit {
    productId: number;
    name: string;
    productNumber: string;
    categoryId: number | null;
    parentCategoryId: number | null;
    productModelId: number | null;
    hasOrders: boolean;
}
