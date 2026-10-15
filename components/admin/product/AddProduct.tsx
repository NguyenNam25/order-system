"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import type { ProductForm } from "@/interfaces/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import productApi from "@/api/routes/productApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/schemas/productSchema";
import ProductField from "./ProductField";

export default function AddProduct() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductForm>({
    defaultValues: {
      categoryId: 0,
    },
    resolver: zodResolver(productSchema),
  });

  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: productApi.createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Product add succesfully");
      reset();
      setImages([]);
      setOpen(false);
    },

    onError: (error) => {
      toast.error("Failed to add new product");
    },
  });

  const onSubmit = async (data: ProductForm) => {
    try {
      const product = await createProductMutation.mutateAsync({
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        categoryId: data.categoryId,
        description: data.description,
      });

      for (const file of images) {
        await productApi.addProductImageFile(product.id, file);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]">
        + Thêm sản phẩm
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl! gap-6 overflow-y-auto rounded-xl border bg-background p-6 shadow-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Thêm sản phẩm mới
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-muted-foreground">
            Điền thông tin chi tiết và hình ảnh cho sản phẩm của bạn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ProductField
            register={register}
            errors={errors}
            reset={reset}
            control={control}
            images={images}
            onImagesChange={setImages}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}