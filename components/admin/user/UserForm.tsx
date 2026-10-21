"use client";

import type {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  Path,
} from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface UserFormValues extends FieldValues {
  fullname: string;
  phone: string;
  email: string;
}

interface UserFormFieldsProps<T extends UserFormValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export default function UserFormFields<T extends UserFormValues>({
  register,
  errors,
}: UserFormFieldsProps<T>) {
  const fullname = "fullname" as Path<T>;
  const phone = "phone" as Path<T>;
  const email = "email" as Path<T>;
  return (
    <FieldGroup className="gap-5">
      <Field className="gap-2">
        <FieldLabel htmlFor="fullname">Họ và tên</FieldLabel>

        <Input
          {...register(fullname)}
          id="fullname"
          type="text"
          placeholder="Nhập họ và tên"
        />

        {errors.fullname?.message && (
          <p className="text-sm text-destructive">
            {String(errors.fullname.message)}
          </p>
        )}
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>

        <Input
          {...register(phone)}
          id="phone"
          type="tel"
          placeholder="Nhập số điện thoại"
        />

        {errors.phone?.message && (
          <p className="text-sm text-destructive">
            {String(errors.phone.message)}
          </p>
        )}
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="email">Email</FieldLabel>

        <Input
          {...register(email)}
          id="email"
          type="email"
          placeholder="example@gmail.com"
        />

        {errors.email?.message && (
          <p className="text-sm text-destructive">
            {String(errors.email.message)}
          </p>
        )}
      </Field>
    </FieldGroup>
  );
}
