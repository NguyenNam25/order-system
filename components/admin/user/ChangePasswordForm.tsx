
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import type { AdminPasswordUpdateForm } from "@/schemas/userSchema";

interface ChangePasswordFormProps {
  register: UseFormRegister<AdminPasswordUpdateForm>;
  errors: FieldErrors<AdminPasswordUpdateForm>;
  reset: UseFormReset<AdminPasswordUpdateForm>;
  isPending: boolean;
}

export default function ChangePasswordForm({
  register,
  errors,
  reset,
  isPending,
}: ChangePasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <FieldGroup className="gap-5">
      <Field className="gap-2">
        <FieldLabel htmlFor="newPassword" className="text-sm font-medium">
          Mật khẩu mới
        </FieldLabel>

        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            autoComplete="new-password"
            className="h-10 rounded-lg pr-10"
            {...register("newPassword")}
          />

          <button
            type="button"
            aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
        <FieldLabel htmlFor="confirmPassword" className="text-sm font-medium">
          Xác nhận mật khẩu mới
        </FieldLabel>

        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            autoComplete="new-password"
            className="h-10 rounded-lg pr-10"
            {...register("confirmPassword")}
          />

          <button
            type="button"
            aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
          onClick={() => {
            reset();
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
          }}
          disabled={isPending}
          className="h-10 rounded-lg px-4"
        >
          Đặt lại
        </Button>

        <Button
          type="submit"
          disabled={isPending}
          className="h-10 rounded-lg px-4 shadow-sm"
        >
          {isPending ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </Button>
      </div>
    </FieldGroup>
  );
}
