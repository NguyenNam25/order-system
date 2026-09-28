import { ProductDisplay } from "./product";
import { User } from "./user";

export interface Order {
  id: number;
  userId: number;
  phone: string;
  address: string;
  note: string | null;
  cancelNote: string | null;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPING"
    | "COMPLETED"
    | "CANCELLED"
    | "RETURNED";
  items: OrderItem[];
  total: number;
  createdAt: Date;
  user: User;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  product: ProductDisplay;
}
