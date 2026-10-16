"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { UserUpdate } from "@/interfaces/user";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface UserFormFieldsProps {
  register: UseFormRegister<UserUpdate>;
  errors: FieldErrors<UserUpdate>;
}

export default function UserFormFields({
  register,
  errors,
}: UserFormFieldsProps) {
  return (
    <FieldGroup className="gap-5">
      <Field className="gap-2">
        <FieldLabel htmlFor="fullname">Họ và tên</FieldLabel>

        <Input
          {...register("fullname")}
          id="fullname"
          type="text"
          placeholder="Nhập họ và tên"
        />

        {errors.fullname?.message && (
          <p className="text-sm text-destructive">{errors.fullname.message}</p>
        )}
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>

        <Input
          {...register("phone")}
          id="phone"
          type="tel"
          placeholder="Nhập số điện thoại"
        />

        {errors.phone?.message && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="email">Email</FieldLabel>

        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="example@gmail.com"
        />

        {errors.email?.message && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </Field>
    </FieldGroup>
  );
}
