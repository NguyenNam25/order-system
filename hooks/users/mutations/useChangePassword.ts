import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import userApi from "@/api/routes/userApi";
import type { AdminChangePassword } from "@/interfaces/user";

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminChangePassword) =>
      userApi.changePassword(payload.id, payload.password),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success("Đặt lại mật khẩu thành công");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
        );
        return;
      }

      toast.error("Đã xảy ra lỗi khi đặt lại mật khẩu");
    },
  });
}
