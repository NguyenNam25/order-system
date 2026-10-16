"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { CategoryForm } from "@/interfaces/category";
import { categorySchema } from "@/schemas/categoryShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import CategoryField from "./CategoryField";
import { useCreateCategory } from "@/hooks/categories/mutations/useCreateCategory";

export default function AddCategory() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const createCategoryMutation = useCreateCategory();

  const onSubmit = (data: CategoryForm) => {
    createCategoryMutation.mutate(
      { name: data.name },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (createCategoryMutation.isPending) return;

    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
        <Plus className="h-4 w-4" />
        Thêm danh mục
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Thêm danh mục mới
          </DialogTitle>

          <DialogDescription>
            Nhập tên danh mục bạn muốn thêm vào hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CategoryField register={register} errors={errors} />

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createCategoryMutation.isPending}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              disabled={createCategoryMutation.isPending}
              className="min-w-28"
            >
              {createCategoryMutation.isPending
                ? "Đang lưu..."
                : "Lưu danh mục"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
