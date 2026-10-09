import { User, UserRegister } from "@/interfaces/user";
import axiosClient from "../axiosConfiguration";
import { Order } from "@/interfaces/order";

interface CreateOrderData {
  receiverName: string;
  phone: string;
  address: string;
  note?: string;
  itemIds: number[];
}

const orderApi = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get("/orders");

    return response.data.orders;
  },
  getOrdersByStatus: async (status: Order["status"][]) => {
    const response = await axiosClient.get("/orders", {
      params: {
        status: status.join(","),
      },
    });

    return response.data.orders;
  },
  getMyOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get("/orders/me");

    return response.data.orders;
  },
  createOrder: async (data: CreateOrderData) => {
    const response = await axiosClient.post("/orders", data);

    return response.data;
  },

  deleteOrder: async (id: number): Promise<Order> => {
    const response = await axiosClient.delete(`/orders/${id}`);

    return response.data.order;
  },

  updateOrderStatus: async (
    id: number,
    status: Order["status"],
    data?: {
      cancelNote?: string;
      returnNote?: string;
      returnMethod?: "REFUND" | "EXCHANGE";
      returnRejectNote?: string;
    },
  ) => {
    const response = await axiosClient.patch(`/orders/${id}`, {
      status,
      ...data,
    });

    return response.data;
  },
};

export default orderApi;
