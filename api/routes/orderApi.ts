import { User, UserRegister } from "@/interfaces/user";
import axiosClient from "../axiosConfiguration";
import { Order } from "@/interfaces/order";

export interface CreateOrderRequest {
  receiverName: string;
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
  deleteOrder: async (id: number): Promise<Order> => {
    const response = await axiosClient.delete(`/orders/${id}`)

    return response.data.order;
  },

  updateOrderStatus: async (id: number, status: Order["status"], cancelNote: string, role: Order["role"]) => {
    const response = await axiosClient.patch(`/orders/${id}`, {
      status,
      cancelNote,
      role
    });

    return response.data;
  },
};

export default orderApi;
