import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import productApi from "@/api/routes/productApi";
import type { ProductForm } from "@/interfaces/product";

interface UpdateProductParams {
  id: number;
  product: ProductForm;
  newImages: File[];
  deletedImageIds: number[];
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      product,
      newImages,
      deletedImageIds,
    }: UpdateProductParams) => {
      // Cập nhật thông tin sản phẩm
      const updatedProduct = await productApi.updateProduct(id, product);

      // Xóa ảnh cũ được chọn
      for (const imageId of deletedImageIds) {
        await productApi.deleteProductImage(id, imageId);
      }

      // Tải ảnh mới
      for (const file of newImages) {
        await productApi.addProductImageFile(id, file);
      }

      return updatedProduct;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Cập nhật sản phẩm thành công");
    },

    onError: () => {
      toast.error("Không thể cập nhật sản phẩm");
    },
  });
}
