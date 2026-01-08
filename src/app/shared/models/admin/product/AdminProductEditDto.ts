export interface AdminProductEditDto {
    productId: number;
    productCategoryId: number | null;
    productModelId: number | null;
    productNumber: string;
    name: string;
    hasOrders: boolean;
}

// Leggi per evitare confusioni:
/**
 * Lo scopo di questo dto è di popolare
 * il "edit form" o i campi per modificare gli attributi 
 * del prodotto quando clicchi un prodotto dalla lista 
 */