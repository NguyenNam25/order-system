
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import userApi from "@/api/routes/userApi";
import type { PasswordUpdate } from "@/interfaces/user";

interface ChangePasswordParams {
  id: number;
  password: PasswordUpdate;
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, password }: ChangePasswordParams) =>
      userApi.ChangePassword(id, password),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success("Đổi mật khẩu thành công");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Không thể đổi mật khẩu. Vui lòng thử lại.",
        );
        return;
      }

      toast.error("Đã xảy ra lỗi khi đổi mật khẩu");
    },
  });
}
