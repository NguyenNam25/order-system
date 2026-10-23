import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Product, ProductForm } from "@/interfaces/product";
import { productSchema } from "@/schemas/productSchema";

export function useUpdateProductForm(data: Product, open: boolean) {
  const form = useForm<ProductForm>({
    defaultValues: {
      name: data.name,
      price: data.price,
      categoryId: data.categoryId,
      quantity: data.quantity,
      description: data.description,
    },
    resolver: zodResolver(productSchema),
  });

  const { reset } = form;

  const resetForm = useCallback(() => {
    reset({
      name: data.name,
      price: data.price,
      categoryId: data.categoryId,
      quantity: data.quantity,
      description: data.description,
    });
  }, [data, reset]);

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

  return {
    ...form,
    resetForm,
  };
}