"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product, ProductForm } from "@/types/product";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import productApi from "@/api/Routes/productApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/schemas/productSchema";
import ProductField from "./ProductField";

export default function UpdateProduct({
  data,
  open,
  onOpenChange,
}: {
  data: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ProductForm>({
    defaultValues: {
      name: data.name,
      price: data.price,
      categoryId: data.categoryId,
      description: data.description,
    },
    resolver: zodResolver(productSchema),
  });

  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({
    mutationFn: ({ id, product }: { id: number; product: ProductForm }) =>
      productApi.updateProduct(id, product),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Product updated successfully");
      onOpenChange(false);
    },

    onError: () => {
      toast.error("Failed to update category");
    },
  });

  const onUpdate = (formData: ProductForm) => {
    console.log(formData);
    updateProductMutation.mutate({
      id: data.id,
      product: {
        name: formData.name,
        price: formData.price,
        categoryId: formData.categoryId,
        description: formData.description,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>Update information of product</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onUpdate)}>
          <ProductField register={register} errors={errors} reset={reset} control={control}/>
        </form>
      </DialogContent>
    </Dialog>
  );
}
