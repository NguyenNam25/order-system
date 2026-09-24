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
import type { Category, CategoryForm } from "@/interfaces/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import categoryApi from "@/api/routes/categoryApi";
import { categorySchema } from "@/schemas/categoryShema";
import { zodResolver } from "@hookform/resolvers/zod";
import CategoryField from "./CategoryField";

export default function AddCategory() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: categoryApi.createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success("Category added successfully");
      reset();
      setOpen(false);
    },

    onError: () => {
      toast.error("Failed to add category");
    },
  });

  const onSubmit = async (data: CategoryForm) => {
    createCategoryMutation.mutate({
      name: data.name,
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
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>Add new category</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CategoryField register={register} errors={errors} reset={reset} />
        </form>
      </DialogContent>
    </Dialog>
  );
}