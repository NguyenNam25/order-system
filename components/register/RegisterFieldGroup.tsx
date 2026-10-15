import {
  UserRound,
  Phone,
  Mail,
  LockKeyhole,
} from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { UserRegister } from "@/interfaces/user";

type FormProp = {
  register: UseFormRegister<UserRegister>;
  errors: FieldErrors<UserRegister>;
};

export default function RegisterFieldGroup({ register, errors }: FormProp) {
  return (
    <FieldGroup className="gap-4">
      <Field>
        <FieldLabel
          htmlFor="fullname"
          className="text-sm font-medium text-zinc-300"
        >
          Họ và tên
        </FieldLabel>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            {...register("fullname")}
            id="fullname"
            type="text"
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            aria-invalid={!!errors.fullname}
            className="h-11 rounded-xl border-white/10 bg-[#1A1A1F] pl-10 text-sm text-white placeholder:text-zinc-600 focus-visible:border-[#FF0033]/60 focus-visible:ring-[#FF0033]/20"
          />
        </div>
        {errors.fullname && (
          <p className="text-xs text-red-400">{errors.fullname.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel
          htmlFor="phone"
          className="text-sm font-medium text-zinc-300"
        >
          Số điện thoại
        </FieldLabel>
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            {...register("phone")}
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Nhập số điện thoại"
            aria-invalid={!!errors.phone}
            className="h-11 rounded-xl border-white/10 bg-[#1A1A1F] pl-10 text-sm text-white placeholder:text-zinc-600 focus-visible:border-[#FF0033]/60 focus-visible:ring-[#FF0033]/20"
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-400">{errors.phone.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel
          htmlFor="email"
          className="text-sm font-medium text-zinc-300"
        >
          Email
        </FieldLabel>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            aria-invalid={!!errors.email}
            className="h-11 rounded-xl border-white/10 bg-[#1A1A1F] pl-10 text-sm text-white placeholder:text-zinc-600 focus-visible:border-[#FF0033]/60 focus-visible:ring-[#FF0033]/20"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel
          htmlFor="password"
          className="text-sm font-medium text-zinc-300"
        >
          Mật khẩu
        </FieldLabel>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            {...register("password")}
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Nhập mật khẩu"
            aria-invalid={!!errors.password}
            className="h-11 rounded-xl border-white/10 bg-[#1A1A1F] pl-10 text-sm text-white placeholder:text-zinc-600 focus-visible:border-[#FF0033]/60 focus-visible:ring-[#FF0033]/20"
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </Field>
    </FieldGroup>
  );
}
