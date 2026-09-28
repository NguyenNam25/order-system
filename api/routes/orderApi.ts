import { User, UserRegister } from "@/interfaces/user";
import axiosClient from "../axiosConfiguration";
import { Order } from "@/interfaces/order";

export interface CreateOrderRequest {
  phone: string;
  address: string;
  note?: string;
}

const orderApi = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get("/orders");

    return response.data.orders;
  },
  getMyOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get("/orders/me");

    return response.data.orders;
  },
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await axiosClient.post("/orders", data);

    return response.data.order;
  },

  updateOrderStatus: async (id: number, status: Order["status"], note: string) => {
    const response = await axiosClient.patch(`/orders/${id}`, {
      status,
      note,
    });

    return response.data;
  },
};

export default orderApi;
