import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/interfaces/user";
import { UseMutationResult } from "@tanstack/react-query";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

type LoginFormType = {
  email: string;
  password: string;
};

type LoginFormProp = {
  register: UseFormRegister<LoginFormType>;
  errors: FieldErrors<LoginFormType>;
  loginMutation: UseMutationResult<
    { user: User },
    Error,
    LoginFormType
  >;
  onSubmit: SubmitHandler<LoginFormType>
  handleSubmit: UseFormHandleSubmit<LoginFormType>;
};

export default function LoginForm({ register, errors, loginMutation, onSubmit, handleSubmit }: LoginFormProp) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-[#D4D4D8]">
          Email
        </Label>

        <div className="group relative">
          <Mail className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#71717A] transition-colors group-focus-within:text-[#FF335C]" />

          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="h-12 rounded-xl border-[#303036] bg-[#19191E] pl-11 text-white placeholder:text-[#666670] transition-all focus-visible:border-[#FF0033] focus-visible:ring-2 focus-visible:ring-[#FF0033]/20"
            {...register("email", {
              required: "Vui lòng nhập email",
            })}
          />
        </div>

        {errors.email && (
          <p className="text-xs text-[#FF5575]">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-[#D4D4D8]"
        >
          Mật khẩu
        </Label>

        <div className="group relative">
          <LockKeyhole className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#71717A] transition-colors group-focus-within:text-[#FF335C]" />

          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            className="h-12 rounded-xl border-[#303036] bg-[#19191E] pl-11 pr-11 text-white placeholder:text-[#666670] transition-all focus-visible:border-[#FF0033] focus-visible:ring-2 focus-visible:ring-[#FF0033]/20"
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
            })}
          />

          <button
            type="button"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#71717A] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0033]"
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" />
            ) : (
              <Eye className="h-4.5 w-4.5" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-[#FF5575]">{errors.password.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <span className="text-sm text-[#A1A1AA] transition-colors hover:text-[#FF335C]">
          Quên mật khẩu?
        </span>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="group h-12 w-full rounded-xl bg-[#FF0033] text-sm font-bold text-white shadow-[0_4px_20px_rgba(255,0,51,0.16)] transition-all duration-200 hover:bg-[#E6002E] hover:shadow-[0_4px_28px_rgba(255,0,51,0.3)] disabled:opacity-60"
      >
        {loginMutation.isPending ? (
          "Đang đăng nhập..."
        ) : (
          <span className="flex items-center justify-center gap-2">
            Đăng nhập
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </Button>
    </form>
  );
}
