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
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import type { UserCreate } from "@/interfaces/user";
import { userCreateSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUser } from "@/hooks/users/mutations/useCreateUser";
import UserForm from "./UserForm";

export default function AddUser() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<UserCreate>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      role: "USER",
    },
  });

  const role = useWatch({
    control,
    name: "role",
  });

  const createUserMutation = useCreateUser();

  const onSubmit = (data: UserCreate) => {
    createUserMutation.mutate(data, {
      onSuccess: () => {
        reset({ role: "USER" });
        setOpen(false);
      },
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
            <UserForm register={register} errors={errors} />

            {/* Trường riêng của AddUser */}
            <Field className="gap-2">
              <FieldLabel htmlFor="role">Vai trò</FieldLabel>

              <Select
                value={role}
                onValueChange={(value) =>
                  setValue("role", value as "USER" | "ADMIN", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="USER">Người dùng</SelectItem>
                  <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>

              {errors.role?.message && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>

              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
              />

              {errors.password?.message && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </Field>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset({ role: "USER" })}
                disabled={createUserMutation.isPending}
              >
                Đặt lại
              </Button>

              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending
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
