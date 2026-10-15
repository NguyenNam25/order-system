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
import type { User, UserRegister, UserUpdate } from "@/interfaces/user";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userApi from "@/api/routes/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, userSchema } from "@/schemas/userSchema";

export default function UpdateUser({
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
  } = useForm<UserUpdate>({
    defaultValues: {
      fullname: data.fullname,
      email: data.email,
    },
    resolver: zodResolver(updateUserSchema),
  });

  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: number; user: UserUpdate }) =>
      userApi.updateUser(id, user),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Update successfully");
      onOpenChange(false);
    },
  });

  const onUpdate = (formdata: UserUpdate) => {
    updateUserMutation.mutate({
      id: data.id,
      user: {
        fullname: formdata.fullname,
        email: formdata.email,
        phone: formdata.phone,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <FieldGroup className="gap-5">
            <Field className="gap-2">
              <FieldLabel
                htmlFor="fullname"
                className="text-sm font-medium"
              >
                Họ và tên
              </FieldLabel>
              <Input
                {...register("fullname")}
                id="fullname"
                type="text"
                placeholder="Nhập họ và tên"
                className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />

              {errors.fullname && (
                <p className="text-sm text-destructive">
                  {errors.fullname.message}
                </p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel
                htmlFor="email"
                className="text-sm font-medium"
              >
                Email
              </FieldLabel>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel
                htmlFor="phone"
                className="text-sm font-medium"
              >
                Số điện thoại
              </FieldLabel>
              <Input
                {...register("phone")}
                id="phone"
                type="text"
                placeholder="Nhập số điện thoại"
                className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />

              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
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
                Lưu thay đổi
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
