export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  thumbnailPhotoFileName?: string;  
  addedDate: string;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
}

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartDto {
  quantity: number;
}
