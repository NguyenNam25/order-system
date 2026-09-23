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
import type { ProductForm } from "@/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import productApi from "@/api/Routes/productApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/schemas/productSchema";
import ProductField from "./ProductField";

export default function AddProduct() {
  const [open, setOpen] = useState(false);

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
      setOpen(false);
    },

    onError: (error) => {
      toast.error("Failed to add new product");
    },
  });

  const onSubmit = async (data: ProductForm) => {
    createProductMutation.mutate({
      name: data.name,
      price: data.price,
      categoryId: data.categoryId,
      description: data.description,
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={"border py-1 px-2 rounded-lg text-white bg-black"}
      >
        Add
      </DialogTrigger>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription>Add new product</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ProductField register={register} errors={errors} reset={reset} control={control}/>
        </form>
      </DialogContent>
    </Dialog>
  );
}
