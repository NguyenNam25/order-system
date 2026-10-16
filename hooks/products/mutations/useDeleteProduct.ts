import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import productApi from "@/api/routes/productApi";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productApi.deleteProduct(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Xóa sản phẩm thành công");
    },

    onError: () => {
      toast.error("Không thể xóa sản phẩm");
    },
  });
}
