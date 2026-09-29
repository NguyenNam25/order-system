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
    const response = await axiosClient.post("/cart", data);

    return response.data;
  },

  updateCartItem: async (cartItemId: number, quantity: number) => {
    const response = await axiosClient.put(`/cart/items/${cartItemId}`, {
      quantity,
    });

    return response.data;
  },
  deleteCartItem: async (cartItemId: number) => {
    const response = await axiosClient.delete(`/cart/items/${cartItemId}`);

    return response.data;
  },
  deleteAllCartItem: async () => {
    const response = await axiosClient.delete('/cart/items');

    return response.data
  }
};

export default cartApi;
