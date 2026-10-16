import { useState } from "react";
import type { ProductImage } from "@/interfaces/product";

export function useProductImages(initialImages: ProductImage[] = []) {
  const [existingImages, setExistingImages] =
    useState<ProductImage[]>(initialImages);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const resetImages = (images: ProductImage[] = []) => {
    setExistingImages(images);
    setNewImages([]);
    setDeletedImageIds([]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    setNewImages((prev) => [...prev, ...Array.from(files)]);

    // Cho phép chọn lại cùng một file.
    event.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((image) => image.id !== imageId));

    setDeletedImageIds((prev) =>
      prev.includes(imageId) ? prev : [...prev, imageId],
    );
  };

  return {
    existingImages,
    newImages,
    deletedImageIds,
    handleFileChange,
    removeNewImage,
    removeExistingImage,
    resetImages,
  };
}
