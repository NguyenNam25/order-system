import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

import authApi from "@/api/routes/authApi";

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success("Tạo người dùng thành công");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Không thể tạo người dùng. Vui lòng thử lại.",
        );
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    },
  });
}
