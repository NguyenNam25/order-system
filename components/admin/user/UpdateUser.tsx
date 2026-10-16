
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { User, UserUpdate } from "@/interfaces/user";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/schemas/userSchema";
import { useUpdateUser } from "@/hooks/users/mutations/useUpdateUser";
import UserFormFields from "./UserForm";


interface UpdateUserProps {
  data: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateUser({
  data,
  open,
  onOpenChange,
}: UpdateUserProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserUpdate>({
    defaultValues: {
      fullname: data.fullname,
      email: data.email,
      phone: data.phone ?? "",
    },
    resolver: zodResolver(updateUserSchema),
  });

  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (!open) return;

    reset({
      fullname: data.fullname,
      email: data.email,
      phone: data.phone ?? "",
    });
  }, [
    open,
    data.id,
    data.fullname,
    data.email,
    data.phone,
    reset,
  ]);

  const onUpdate = (formData: UserUpdate) => {
    updateUserMutation.mutate(
      {
        id: data.id,
        user: formData,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (updateUserMutation.isPending) return;
    onOpenChange(nextOpen);
  };

  const handleReset = () => {
    reset({
      fullname: data.fullname,
      email: data.email,
      phone: data.phone ?? "",
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-h-[90vh] max-w-md! gap-6 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-xl">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Chỉnh sửa người dùng
          </DialogTitle>

          <DialogDescription className="text-sm leading-5 text-muted-foreground">
            Cập nhật thông tin tài khoản người dùng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onUpdate)}>
          <div className="space-y-5">
            <UserFormFields
              register={register}
              errors={errors}
            />

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={updateUserMutation.isPending}
                className="h-10 rounded-lg border-input px-4"
              >
                Đặt lại
              </Button>

              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="h-10 rounded-lg px-4 shadow-sm"
              >
                {updateUserMutation.isPending
                  ? "Đang lưu..."
                  : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
