"use client";

import authApi from "@/api/routes/authApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRegister } from "@/interfaces/user";
import { userSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserPlus, ArrowLeft, LoaderCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";
import logo from "@/public/asus-rog-1-logo-svgrepo-com.png";
import RegisterBg from "@/components/register/RegisterBg";
import RegisterFieldGroup from "@/components/register/RegisterFieldGroup";

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserRegister>({
    resolver: zodResolver(userSchema),
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: authApi.register,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success("Đăng ký tài khoản thành công!");
      reset();
      router.push("/login");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Đăng ký thất bại. Vui lòng thử lại.",
        );
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    },
  });

  const onSubmit = (data: UserRegister) => {
    registerMutation.mutate({
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090B] px-4 py-8 text-zinc-100">
      <RegisterBg />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="flex items-center justify-center">
            <Image src={logo} alt="logo" width={96} />
          </Link>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Tạo tài khoản mới
          </h1>
        </div>

        <Card className="gap-0 overflow-hidden rounded-2xl border border-white/9 bg-[#111114]/95 py-0 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="h-1 w-full bg-linear-to-r from-transparent via-[#FF0033] to-transparent" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className="px-5 pb-2 pt-6 sm:px-7">
              <CardTitle className="text-lg font-semibold text-white">
                Thông tin đăng ký
              </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pt-5 sm:px-7">
              <RegisterFieldGroup register={register} errors={errors} />

              <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/6 bg-white/2.5 p-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                <p className="text-xs leading-5 text-zinc-400">
                  Thông tin tài khoản được sử dụng để hỗ trợ đăng nhập và xử lý
                  đơn hàng của bạn.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 px-5 pb-6 pt-6 sm:px-7">
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="h-11 w-full rounded-xl bg-[#FF0033] font-semibold text-white shadow-lg shadow-[#FF0033]/10 transition-colors hover:bg-[#D9002B] disabled:opacity-60"
              >
                {registerMutation.isPending ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 size-4" />
                    Tạo tài khoản
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/login")}
                className="h-11 w-full rounded-xl border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft className="mr-2 size-4" />
                Quay lại đăng nhập
              </Button>

              <p className="pt-1 text-center text-sm text-zinc-500">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="font-medium text-[#FF4D6D] transition-colors hover:text-red-300"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-5 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} · Secure account registration
        </p>
      </div>
    </main>
  );
}
