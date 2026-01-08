interface AdminProductFormSnapshot {
  parentCategoryId: number | null;
  productCategoryId: number | null;
  productModelId: number | null;
  productNumber: string;
  name: string;

  listPrice: number;
  standardCost: number;

  color?: string | null;
  size?: string | null;
  weight?: number | null;

  sellStartDate: string | null;
  sellEndDate: string | null;
  discontinuedDate: string | null;
}

// Leggi per evitare confusioni:
/**
 * Questo dto servirà solo per confrontare i 
 * dati che avevi rispetto alle modifiche che
 * stai per applicare
 */