import axiosClient from "../axiosConfiguration";
import { Cart, CartItem } from "@/interfaces/cart";

interface AddCartRequest {
  productId: number;
  quantity: number;
}

export interface AddCartResponse {
  message: string;
  cartItem: CartItem;
}

const cartApi = {
  getCart: async (): Promise<Cart | null> => {
    const response = await axiosClient.get("/cart");

    return response.data.cart ?? response.data;
  },

  addToCart: async (data: AddCartRequest) => {
    console.log("ADD TO CART:", data);

    const response = await axiosClient.post("/cart", data);

    return response.data;
  },
};

export default cartApi;
