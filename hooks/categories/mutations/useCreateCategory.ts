import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import categoryApi from "@/api/routes/categoryApi";
import type { CategoryForm } from "@/interfaces/category";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryForm) => categoryApi.createCategory(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      toast.success("Thêm danh mục thành công");
    },

    onError: () => {
      toast.error("Không thể thêm danh mục. Vui lòng thử lại.");
    },
  });
}
