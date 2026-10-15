"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  PasswordUpdate,
  User,
  UserRegister,
  UserUpdate,
} from "@/interfaces/user";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userApi from "@/api/routes/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PasswordUpdateSchema,
  updateUserSchema,
  userSchema,
} from "@/schemas/userSchema";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

type ChangePassForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePassword({
  data,
  open,
  onOpenChange,
}: {
  data: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePassForm>({
    resolver: zodResolver(PasswordUpdateSchema),
  });

  const queryClient = useQueryClient();

  const updatePassMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: PasswordUpdate }) =>
      userApi.ChangePassword(id, password),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Update successfully");
      onOpenChange(false);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    },
  });

  const onUpdate = (formdata: ChangePassForm) => {
    updatePassMutation.mutate({
      id: data.id,
      password: {
        currentPassword: formdata.currentPassword,
        newPassword: formdata.newPassword,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <FieldGroup className="gap-5">
            <Field className="gap-2">
              <FieldLabel
                htmlFor="currentPassword"
                className="text-sm font-medium"
              >
                Mật khẩu hiện tại
              </FieldLabel>

              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  className="h-10 rounded-lg border-input bg-background pr-10 shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                  {...register("currentPassword")}
                  id="currentPassword"
                  placeholder="Nhập mật khẩu hiện tại"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {errors.currentPassword && (
                <p className="text-sm text-destructive">
                  {errors.currentPassword.message}
                </p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel
                htmlFor="password"
                className="text-sm font-medium"
              >
                Mật khẩu mới
              </FieldLabel>

              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  className="h-10 rounded-lg border-input bg-background pr-10 shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                  {...register("newPassword")}
                  id="password"
                  placeholder="Nhập mật khẩu mới"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {errors.newPassword && (
                <p className="text-sm text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                Xác nhận mật khẩu mới
              </FieldLabel>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="h-10 rounded-lg border-input bg-background pr-10 shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu mới"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </Field>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                className="h-10 rounded-lg border-input px-4"
              >
                Đặt lại
              </Button>

              <Button
                type="submit"
                className="h-10 rounded-lg px-4 shadow-sm"
              >
                Đổi mật khẩu
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
