"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Category, CategoryForm } from "@/interfaces/category";
import { useForm } from "react-hook-form";
import CategoryField from "./CategoryField";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/schemas/categoryShema";
import { useUpdateCategory } from "@/hooks/categories/mutations/useUpdateCategory";

export default function UpdateCategory({
  data,
  open,
  onOpenChange,
}: {
  data: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    defaultValues: {
      name: data.name,
    },
    resolver: zodResolver(categorySchema),
  });

  const updateCategoryMutation = useUpdateCategory();

  const onUpdate = (formData: CategoryForm) => {
    updateCategoryMutation.mutate(
      {
        id: data.id,
        category: {
          name: formData.name.trim(),
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (updateCategoryMutation.isPending) return;

    onOpenChange(nextOpen);

    if (!nextOpen) {
      reset({ name: data.name });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Chỉnh sửa danh mục
          </DialogTitle>

          <DialogDescription>
            Cập nhật tên danh mục #{data.id}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
          <CategoryField register={register} errors={errors} />

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updateCategoryMutation.isPending}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              disabled={updateCategoryMutation.isPending}
              className="min-w-32"
            >
              {updateCategoryMutation.isPending
                ? "Đang cập nhật..."
                : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
