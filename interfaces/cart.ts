export interface Cart {
  id: number;
  userId: number;
  createdAt: Date;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
}
