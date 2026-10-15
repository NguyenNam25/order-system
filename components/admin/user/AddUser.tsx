
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import type { User, UserRegister } from "@/interfaces/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import authApi from "@/api/routes/authApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddUser() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserRegister>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "USER",
    },
  });

  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    mutationFn: authApi.register,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Create succesfully");
      reset();
      setOpen(false);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    },
  });

  const onSubmit = (data: UserRegister) => {
    addUserMutation.mutate({
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30">
        + Thêm người dùng
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-xl! gap-6 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-xl">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Thêm người dùng
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 text-muted-foreground">
            Nhập thông tin tài khoản và phân quyền cho người dùng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
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

            <Field className="gap-2">
              <FieldLabel className="text-sm font-medium">
                Vai trò
              </FieldLabel>

              <Select
                onValueChange={(value) =>
                  setValue("role", value as "USER" | "ADMIN", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-10 w-full rounded-lg border-input bg-background px-3 text-sm shadow-none transition-colors hover:border-muted-foreground/50 focus:border-ring focus:ring-2 focus:ring-ring/20">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>

                <SelectContent className="rounded-lg border border-border bg-popover p-1 shadow-lg">
                  <SelectItem
                    value="USER"
                    className="cursor-pointer rounded-md text-sm"
                  >
                    Người dùng
                  </SelectItem>
                  <SelectItem
                    value="ADMIN"
                    className="cursor-pointer rounded-md text-sm"
                  >
                    Quản trị viên
                  </SelectItem>
                </SelectContent>
              </Select>

              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
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
                htmlFor="password"
                className="text-sm font-medium"
              >
                Mật khẩu
              </FieldLabel>
              <Input
                {...register("password")}
                id="password"
                type="text"
                placeholder="Nhập mật khẩu"
                className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
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
                disabled={addUserMutation.isPending}
                className="h-10 rounded-lg px-4 shadow-sm"
              >
                {addUserMutation.isPending
                  ? "Đang tạo..."
                  : "Tạo người dùng"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
