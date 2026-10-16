import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import categoryApi from "@/api/routes/categoryApi";
import type { CategoryForm } from "@/interfaces/category";

interface UpdateCategoryParams {
  id: number;
  category: CategoryForm;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, category }: UpdateCategoryParams) =>
      categoryApi.updateCategory(id, category),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      toast.success("Cập nhật danh mục thành công");
    },

    onError: () => {
      toast.error("Không thể cập nhật danh mục. Vui lòng thử lại.");
    },
  });
}
