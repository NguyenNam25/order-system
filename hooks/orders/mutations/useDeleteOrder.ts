import orderApi from "@/api/routes/orderApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.deleteOrder,

    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success(result.message || "Xóa đơn hàng thành công");
    },

    onError: (error: unknown) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || "Không thể xóa đơn hàng"
        : "Không thể xóa đơn hàng";

      toast.error(message);
    },
  });
}
