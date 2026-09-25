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
import { XIcon } from "lucide-react";
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
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>

          <DialogDescription>Update information of product</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onUpdate)}>
          <FieldGroup className="max-h-[70vh] overflow-y-auto pr-2">
            <Field>
              <FieldLabel htmlFor="images">Product Images</FieldLabel>

              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />

              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Existing Images</p>

                  <AttachmentGroup className="w-full min-w-0 max-w-full overflow-x-auto">
                    {existingImages.map((image) => (
                      <Attachment key={image.id} orientation="vertical">
                        <AttachmentMedia variant="image">
                          <img
                            src={image.imageUrl}
                            alt={data.name}
                          />
                        </AttachmentMedia>

                        <AttachmentContent>
                          <AttachmentTitle>{image.id}</AttachmentTitle>

                          <AttachmentDescription>
                            Product image
                          </AttachmentDescription>
                        </AttachmentContent>

                        <AttachmentAction
                          type="button"
                          aria-label="Remove existing image"
                          onClick={() => removeExistingImage(image.id)}
                        >
                          <XIcon />
                        </AttachmentAction>
                      </Attachment>
                    ))}
                  </AttachmentGroup>
                </div>
              )}

              {newImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">New Images</p>

                  <AttachmentGroup className="w-full min-w-0 max-w-full overflow-x-auto">
                    {newImages.map((file, index) => (
                      <Attachment
                        key={`${file.name}-${index}`}
                        orientation="vertical"
                      >
                        <AttachmentMedia variant="image">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                          />
                        </AttachmentMedia>

                        <AttachmentContent>
                          <AttachmentTitle>{file.name}</AttachmentTitle>

                          <AttachmentDescription>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </AttachmentDescription>
                        </AttachmentContent>

                        <AttachmentAction
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => removeNewImage(index)}
                        >
                          <XIcon />
                        </AttachmentAction>
                      </Attachment>
                    ))}
                  </AttachmentGroup>
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="name">Product Name</FieldLabel>

              <Input {...register("name")} id="name" type="text" required />

              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="price">Price</FieldLabel>

              <Input
                {...register("price", {
                  valueAsNumber: true,
                })}
                id="price"
                type="number"
              />

              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="categoryId">Category</FieldLabel>

              <CategorySelect control={control} />
            </Field>

            <Field>
              <FieldLabel htmlFor="quantity">Quantity</FieldLabel>

              <Input
                {...register("quantity", {
                  valueAsNumber: true,
                })}
                id="quantity"
                type="number"
                min={0}
              />

              {errors.quantity && (
                <p className="text-sm text-red-500">
                  {errors.quantity.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>

              <Textarea
                {...register("description")}
                id="description"
                placeholder="Enter Description"
                className="h-32 max-h-32 overflow-y-auto"
              />

              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </Field>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>

              <Button type="submit" disabled={updateProductMutation.isPending}>
                {updateProductMutation.isPending ? "Updating..." : "Submit"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
