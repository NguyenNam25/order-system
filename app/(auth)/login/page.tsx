"use client";

import authApi from "@/api/routes/authApi";
import { useAuth } from "@/components/auth/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import Image from "next/image";
import logo from "@/public/asus-rog-1-logo-svgrepo-com.png";
import LoginBg from "@/components/login/LoginBg";
import LoginForm from "@/components/login/LoginForm";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginForm) =>
      authApi.login(email, password),

    onSuccess: (data) => {
      login(data.user);
      toast.success("Đăng nhập thành công!");

      if (
        redirect &&
        redirect.startsWith("/") &&
        !redirect.startsWith("//") &&
        !redirect.includes("\\")
      ) {
        router.replace(redirect);
        return;
      }

      router.replace(data.user.role === "ADMIN" ? "/admin" : "/");
    },

    onError: () => {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090B] px-4 py-10 text-white">
      <LoginBg />

      <div className="relative z-10 w-full max-w-110">
        <Link href="/" className="flex items-center justify-center">
          <Image src={logo} alt="logo" width={96} />
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[#29292E] bg-[#111114]/95 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="h-1 w-full bg-linear-to-r from-transparent via-[#FF0033] to-transparent" />

          <div className="p-6 sm:p-9">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF0033]/20 bg-[#FF0033]/10">
                <LockKeyhole className="h-6 w-6 text-[#FF335C]" />
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Đăng nhập
              </h1>
            </div>

            <LoginForm register={register} errors={errors} loginMutation={loginMutation} onSubmit={onSubmit} handleSubmit={handleSubmit} />

            <div className="mt-7 border-t border-[#29292E] pt-6 text-center">
              <p className="text-sm text-[#96969F]">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-white transition-colors hover:text-[#FF335C]"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#71717A]">
          <ShieldCheck className="h-4 w-4 text-[#FF0033]" />
          <span>Đăng nhập an toàn · Trải nghiệm gaming cao cấp</span>
        </div>
      </div>
    </main>
  );
}
