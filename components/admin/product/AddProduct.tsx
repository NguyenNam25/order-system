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
    <Dialog open={open} onOpenChange={setOpen} > 
      <DialogTrigger
        className={"border py-1 px-2 rounded-lg text-white bg-black"}
      >
        Add
      </DialogTrigger>
      <DialogContent className="max-w-2xl! max-h-[95vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription>Add new product</DialogDescription>
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
