"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/interfaces/product";
import { useProductImages } from "@/hooks/products/useProductImages";
import { useUpdateProductForm } from "@/hooks/products/useUpdateProductForm";
import { useUpdateProduct } from "@/hooks/products/mutations/useUpdateProduct";
import UpdateProductForm from "./UpdateProductForm";
import { useEffect } from "react";

interface UpdateProductProps {
  data: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateProduct({
  data,
  open,
  onOpenChange,
}: UpdateProductProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    resetForm,
  } = useUpdateProductForm(data, open);

  const {
    existingImages,
    newImages,
    deletedImageIds,
    handleFileChange,
    removeNewImage,
    removeExistingImage,
    resetImages,
  } = useProductImages(data.images ?? []);

  useEffect(() => {
    if (!open) return;

    resetImages(data.images ?? []);
  }, [data, open, resetImages]);

  const updateProductMutation = useUpdateProduct();

  const handleReset = () => {
    resetForm();
    resetImages(data.images ?? []);
  };

  const onUpdate = async (
    formData: Parameters<typeof handleSubmit>[0] extends never
      ? never
      : import("@/interfaces/product").ProductForm,
  ) => {
    await updateProductMutation.mutateAsync({
      id: data.id,
      product: formData,
      newImages,
      deletedImageIds,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl! gap-6 overflow-y-auto rounded-xl border bg-background p-6 shadow-xl">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Chỉnh sửa sản phẩm
          </DialogTitle>

          <DialogDescription className="text-sm leading-5 text-muted-foreground">
            Cập nhật thông tin và hình ảnh của sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onUpdate)}>
          <UpdateProductForm
            data={data}
            register={register}
            control={control}
            errors={errors}
            existingImages={existingImages}
            newImages={newImages}
            onFileChange={handleFileChange}
            onRemoveExistingImage={removeExistingImage}
            onRemoveNewImage={removeNewImage}
            onReset={handleReset}
            isPending={updateProductMutation.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
