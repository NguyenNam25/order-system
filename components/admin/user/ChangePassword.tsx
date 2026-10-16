"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ChangePassForm, User } from "@/interfaces/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordUpdateSchema } from "@/schemas/userSchema";
import { useChangePassword } from "@/hooks/users/mutations/useChangePassword";
import ChangePasswordForm from "./ChangePasswordForm";

export default function ChangePassword({
  data,
  open,
  onOpenChange,
}: {
  data: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePassForm>({
    resolver: zodResolver(PasswordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useChangePassword();

  const onUpdate = (formData: ChangePassForm) => {
    changePasswordMutation.mutate(
      {
        id: data.id,
        password: {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (changePasswordMutation.isPending) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md! gap-6 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-xl">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Đổi mật khẩu
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 text-muted-foreground">
            Nhập mật khẩu hiện tại và thiết lập mật khẩu mới cho tài khoản.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onUpdate)}>
          <ChangePasswordForm
            register={register}
            errors={errors}
            reset={reset}
            isPending={changePasswordMutation.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
