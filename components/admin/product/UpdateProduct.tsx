"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product, ProductForm, ProductImage } from "@/interfaces/product";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import productApi from "@/api/routes/productApi";
import { productSchema } from "@/schemas/productSchema";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Attachment,
  AttachmentAction,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { RotateCcw, XIcon } from "lucide-react";
import CategorySelect from "./CategorySelect";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function UpdateProduct({
  data,
  open,
  onOpenChange,
}: {
  data: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [existingImages, setExistingImages] = useState<ProductImage[]>(
    data.images ?? [],
  );

  const [newImages, setNewImages] = useState<File[]>([]);

  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductForm>({
    defaultValues: {
      name: data.name,
      price: data.price,
      categoryId: data.categoryId,
      quantity: data.quantity,
      description: data.description,
    },
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    reset({
      name: data.name,
      price: data.price,
      categoryId: data.categoryId,
      quantity: data.quantity,
      description: data.description,
    });

    setExistingImages(data.images ?? []);
    setNewImages([]);
    setDeletedImageIds([]);
  }, [data, reset]);

  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({
    mutationFn: ({ id, product }: { id: number; product: ProductForm }) =>
      productApi.updateProduct(id, product),

    onError: () => {
      toast.error("Failed to update product");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    const selectedFiles = Array.from(files);

    setNewImages((prev) => [...prev, ...selectedFiles]);

    event.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((image) => image.id !== imageId));

    setDeletedImageIds((prev) => {
      if (prev.includes(imageId)) {
        return prev;
      }

      return [...prev, imageId];
    });
  };

  const handleReset = () => {
    reset({
      name: data.name,
      price: data.price,
      categoryId: data.categoryId,
      quantity: data.quantity,
      description: data.description,
    });

    setExistingImages(data.images ?? []);
    setNewImages([]);
    setDeletedImageIds([]);
  };

  const onUpdate = async (formData: ProductForm) => {
    try {
      await updateProductMutation.mutateAsync({
        id: data.id,
        product: {
          name: formData.name,
          price: formData.price,
          categoryId: formData.categoryId,
          quantity: formData.quantity,
          description: formData.description,
        },
      });

      for (const imageId of deletedImageIds) {
        await productApi.deleteProductImage(data.id, imageId);
      }

      for (const file of newImages) {
        await productApi.addProductImageFile(data.id, file);
      }

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Product updated successfully");

      setNewImages([]);
      setDeletedImageIds([]);

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update product:", error);

      toast.error("Failed to update product");
    }
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
          <FieldGroup className="max-h-[70vh] gap-5 overflow-y-auto px-1 pb-1 pr-3">
            <Field className="gap-2">
              <FieldLabel htmlFor="images" className="text-sm font-medium">
                Hình ảnh sản phẩm
              </FieldLabel>

              <div className="rounded-xl border border-border bg-muted/20 p-4 transition-colors hover:border-muted-foreground/50">
                <p className="mb-3 text-sm text-muted-foreground">
                  Chọn hình ảnh mới để bổ sung cho sản phẩm.
                </p>

                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="h-auto cursor-pointer rounded-lg border-input bg-background px-3 py-2 text-sm shadow-none transition-colors hover:border-muted-foreground/50 file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80"
                />
              </div>

              {existingImages.length > 0 && (
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Ảnh hiện tại</p>
                    <span className="text-xs text-muted-foreground">
                      {existingImages.length} ảnh
                    </span>
                  </div>

                  <AttachmentGroup className="grid w-full min-w-0 max-w-full grid-cols-2 gap-3 overflow-x-hidden sm:grid-cols-3">
                    {existingImages.map((image) => (
                      <Attachment
                        key={image.id}
                        orientation="vertical"
                        className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-background"
                      >
                        <AttachmentMedia
                          variant="image"
                          className="aspect-square w-full overflow-hidden bg-muted/30"
                        >
                          <img
                            src={image.imageUrl}
                            alt={data.name}
                            className="size-full object-cover"
                          />
                        </AttachmentMedia>

                        <AttachmentContent className="min-w-0 gap-1 p-3">
                          <AttachmentTitle className="truncate text-xs font-medium">
                            Ảnh #{image.id}
                          </AttachmentTitle>

                          <AttachmentDescription className="text-xs text-muted-foreground">
                            Ảnh sản phẩm hiện tại
                          </AttachmentDescription>
                        </AttachmentContent>

                        <AttachmentAction
                          type="button"
                          aria-label="Remove existing image"
                          onClick={() => removeExistingImage(image.id)}
                          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border border-border bg-background/95 text-muted-foreground shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XIcon className="size-4" />
                        </AttachmentAction>
                      </Attachment>
                    ))}
                  </AttachmentGroup>
                </div>
              )}

              {newImages.length > 0 && (
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Ảnh mới</p>
                    <span className="text-xs text-muted-foreground">
                      {newImages.length} ảnh
                    </span>
                  </div>

                  <AttachmentGroup className="grid w-full min-w-0 max-w-full grid-cols-2 gap-3 overflow-x-hidden sm:grid-cols-3">
                    {newImages.map((file, index) => (
                      <Attachment
                        key={`${file.name}-${index}`}
                        orientation="vertical"
                        className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-background"
                      >
                        <AttachmentMedia
                          variant="image"
                          className="aspect-square w-full overflow-hidden bg-muted/30"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="size-full object-cover"
                          />
                        </AttachmentMedia>

                        <AttachmentContent className="min-w-0 gap-1 p-3">
                          <AttachmentTitle className="truncate text-xs font-medium">
                            {file.name}
                          </AttachmentTitle>

                          <AttachmentDescription className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </AttachmentDescription>
                        </AttachmentContent>

                        <AttachmentAction
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => removeNewImage(index)}
                          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border border-border bg-background/95 text-muted-foreground shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XIcon className="size-4" />
                        </AttachmentAction>
                      </Attachment>
                    ))}
                  </AttachmentGroup>
                </div>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="name" className="text-sm font-medium">
                Tên sản phẩm
              </FieldLabel>

              <Input
                {...register("name")}
                id="name"
                type="text"
                required
                placeholder="Nhập tên sản phẩm"
                className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />

              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="price" className="text-sm font-medium">
                Giá sản phẩm (VNĐ)
              </FieldLabel>

              <Input
                {...register("price", {
                  valueAsNumber: true,
                })}
                id="price"
                type="number"
                placeholder="Nhập giá sản phẩm"
                className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />

              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="categoryId" className="text-sm font-medium">
                Danh mục
              </FieldLabel>

              <CategorySelect control={control} />
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="quantity" className="text-sm font-medium">
                Số lượng tồn kho
              </FieldLabel>

              <Input
                {...register("quantity", {
                  valueAsNumber: true,
                })}
                id="quantity"
                type="number"
                min={0}
                placeholder="Nhập số lượng"
                className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />

              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="description" className="text-sm font-medium">
                Mô tả sản phẩm
              </FieldLabel>

              <Textarea
                {...register("description")}
                id="description"
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                className="min-h-32 max-h-32 resize-none overflow-y-auto rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />

              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </Field>

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="h-10 gap-2 rounded-lg border-input px-4"
              >
                <RotateCcw className="size-4" />
                Đặt lại
              </Button>

              <Button
                type="submit"
                disabled={updateProductMutation.isPending}
                className="h-10 rounded-lg px-5 shadow-sm"
              >
                {updateProductMutation.isPending
                  ? "Đang cập nhật..."
                  : "Lưu thay đổi"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
