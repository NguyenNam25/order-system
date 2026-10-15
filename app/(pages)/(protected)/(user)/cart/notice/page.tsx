"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, House, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Notice() {
  const router = useRouter();

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#09090B] px-4 py-12 text-zinc-100">
      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#18181B] px-6 py-10 text-center shadow-2xl shadow-black/20 sm:px-10 sm:py-12">
          {/* Ánh sáng trang trí */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-[#FF0033]/10 blur-3xl" />

          {/* Biểu tượng thành công */}
          <div className="relative mx-auto mb-6 flex size-24 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
            <CheckCircle2
              className="size-14 text-emerald-400"
              strokeWidth={1.6}
            />
            <span className="absolute inset-0 animate-ping rounded-full border border-emerald-400/20 opacity-20" />
          </div>

          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
            <PackageCheck className="size-4" />
            ĐẶT HÀNG THÀNH CÔNG
          </span>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Cảm ơn bạn đã mua hàng!
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-zinc-400 sm:text-base">
            Đơn hàng của bạn đã được ghi nhận và gửi đến cửa hàng. Chúng tôi sẽ
            tiến hành xác nhận đơn hàng trong thời gian sớm nhất.
          </p>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              onClick={() => router.push("/orders")}
              className="h-12 w-full rounded-lg bg-[#FF0033] font-semibold text-white transition hover:bg-[#D9002B] sm:w-auto sm:min-w-44"
            >
              Xem đơn hàng
              <ArrowRight className="ml-1 size-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="h-12 w-full rounded-lg border-white/10 bg-transparent font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white sm:w-auto sm:min-w-44"
            >
              <House className="mr-1 size-4" />
              Về trang chủ
            </Button>
          </div>

          <p className="mt-7 text-xs text-zinc-600">
            ShopZone · Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi.
          </p>
        </div>
      </div>
    </main>
  );
}
