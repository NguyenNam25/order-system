"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword } from "@/hooks/users/mutations/useChangePassword";
import ChangePasswordForm from "./ChangePasswordForm";
import {
  AdminPasswordUpdateSchema,
  type AdminPasswordUpdateForm,
} from "@/schemas/userSchema";
import { AdminPasswordUpdate } from "@/interfaces/user";

interface ChangePasswordProps {
  data: AdminPasswordUpdate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePassword({
  data,
  open,
  onOpenChange,
}: ChangePasswordProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminPasswordUpdateForm>({
    resolver: zodResolver(AdminPasswordUpdateSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useChangePassword();

  const onUpdate = (formData: AdminPasswordUpdateForm) => {
    changePasswordMutation.mutate(
      {
        id: data.id,
        password: {
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

    if (!nextOpen) reset();

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md! gap-6 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-xl">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Đặt lại mật khẩu người dùng
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 text-muted-foreground">
            Thiết lập mật khẩu mới cho tài khoản {data.fullname}. Không cần nhập
            mật khẩu hiện tại.
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
