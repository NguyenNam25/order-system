import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import productApi from "@/api/routes/productApi";
import type { ProductForm } from "@/interfaces/product";

interface CreateProductParams {
  data: ProductForm;
  images: File[];
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, images }: CreateProductParams) => {
      const product = await productApi.createProduct({
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        categoryId: data.categoryId,
        description: data.description,
      });

      for (const file of images) {
        await productApi.addProductImageFile(product.id, file);
      }

      return product;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Thêm sản phẩm thành công");
    },

    onError: () => {
      toast.error("Không thể thêm sản phẩm");
    },
  });
}
