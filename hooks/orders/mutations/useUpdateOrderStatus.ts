import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

import orderApi from "@/api/routes/orderApi";
import type { Order } from "@/interfaces/order";

export interface UpdateOrderStatusPayload {
  id: number;
  status: Order["status"];
  data?: {
    cancelNote?: string;
    returnMethod?: "REFUND" | "EXCHANGE";
    returnRejectNote?: string;
    returnNote?: string;
  };
  successMessage?: string;
}

export default function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, data }: UpdateOrderStatusPayload) =>
      orderApi.updateOrderStatus(id, status, data),

    onSuccess: async (_result, variables) => {
      if (variables.successMessage) {
        toast.success(variables.successMessage);
      }

      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },

    onError: (error: unknown) => {
      let message = "Cập nhật đơn hàng thất bại";

      if (axios.isAxiosError<{ message?: string }>(error)) {
        message = error.response?.data?.message || message;
      }

      toast.error(message);
    },
  });
}
