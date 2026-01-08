export interface AdminProductUpdateDto {

    productId: number;

    // General:
    productCategoryId: number;
    productModelId: number;
    name: string;
    productNumber: string;

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

// Leggi per evitare confusioni:
/**
 * Questo saranno i dati che verranno passati al backend,
 * quando l'admin avrà applicato le modifiche
 */