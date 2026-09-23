"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category, CategoryForm } from "@/types/category";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import categoryApi from "@/api/Routes/categoryApi";
import CategoryField from "./CategoryField";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/schemas/categoryShema";

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

  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, category }: { id: number; category: CategoryForm }) =>
      categoryApi.updateCategory(id, category),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success("Category added successfully");
      onOpenChange(false);
    },

    onError: () => {
      toast.error("Failed to add category");
    },
  });

  const onUpdate = (formData: CategoryForm) => {
    updateCategoryMutation.mutate({
      id: data.id,
      category: {
        name: formData.name,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>Update information of category</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onUpdate)}>
          <CategoryField register={register} errors={errors} reset={reset} />
        </form>
      </DialogContent>
    </Dialog>
  );
}