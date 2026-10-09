import { ProductDisplay } from "./product";
import { User } from "./user";

export interface Order {
  id: number;
  orderCode: string;
  userId: number;
  receiverName: string;
  phone: string;
  address: string;
  note: string | null;
  cancelNote: string | null;
  returnNote: string | null;
  returnRejectNote: string | null;
  returnMethod: "REFUND" | "EXCHANGE" | null;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPING"
    | "COMPLETED"
    | "CANCELLED"
    | "RETURN_REQUESTED"
    | "RETURN_APPROVED"
    | "RETURN_REJECTED";
  items: OrderItem[];
  role: "USER" | "ADMIN" | null;
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
