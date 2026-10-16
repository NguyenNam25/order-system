import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import userApi from "@/api/routes/userApi";
import type { UserUpdate } from "@/interfaces/user";

interface UpdateUserParams {
  id: number;
  user: UserUpdate;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, user }: UpdateUserParams) =>
      userApi.updateUser(id, user),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success("Cập nhật người dùng thành công");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? "Không thể cập nhật người dùng",
        );
        return;
      }

      toast.error("Đã xảy ra lỗi khi cập nhật người dùng");
    },
  });
}
