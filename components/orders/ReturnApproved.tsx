"use client";

import {
  ArrowLeftRight,
  CheckCircle2,
  CircleDollarSign,
  PackageCheck,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Order } from "@/interfaces/order";

interface ReturnApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (returnMethod: "REFUND" | "EXCHANGE") => void;
}

export default function ReturnApproveDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: ReturnApproveDialogProps) {
  const handleSubmit = (returnMethod: "REFUND" | "EXCHANGE") => {
    onSubmit(returnMethod);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-24px)] max-w-md gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#101013] p-0 text-zinc-100">
        <div className="border-b border-white/[0.07] bg-linear-to-r from-[#FF0033]/10 via-transparent to-transparent px-5 py-5 sm:px-6">
          <DialogHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-[#FF0033]/20 bg-[#FF0033]/10">
              <PackageCheck className="size-5 text-[#FF4D6D]" />
            </div>

            <DialogTitle className="text-lg font-bold text-white">
              Duyệt yêu cầu hoàn hàng
            </DialogTitle>

            <DialogDescription className="mt-2 text-sm leading-6 text-zinc-400">
              Chọn phương án xử lý phù hợp cho yêu cầu hoàn hàng của khách
              hàng.
            </DialogDescription>
          </DialogHeader>
        </div>

        {order && (
          <div className="space-y-5 p-5 sm:p-6">
            <div className="rounded-xl border border-white/[0.07] bg-[#18181C] p-4">
              <p className="text-xs text-zinc-500">Mã đơn hàng</p>
              <p className="mt-1 break-all text-sm font-semibold text-zinc-100">
                {order.orderCode}
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Bạn muốn xử lý yêu cầu hoàn hàng này như thế nào?
              </p>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                onClick={() => handleSubmit("REFUND")}
                className="h-auto w-full justify-start gap-3 rounded-xl border border-[#FF0033]/30 bg-[#FF0033]/10 px-4 py-4 text-left text-white shadow-none hover:bg-[#FF0033]/20"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FF0033]/15">
                  <CircleDollarSign className="size-5 text-[#FF4D6D]" />
                </span>

                <span className="flex-1">
                  <span className="block font-semibold">Hoàn tiền</span>
                  <span className="mt-1 block text-xs font-normal text-zinc-400">
                    Chấp thuận hoàn hàng và xử lý hoàn tiền
                  </span>
                </span>

                <CheckCircle2 className="size-4 shrink-0 text-[#FF4D6D]" />
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit("EXCHANGE")}
                className="h-auto w-full justify-start gap-3 rounded-xl border-white/10 bg-[#18181C] px-4 py-4 text-left text-zinc-100 shadow-none hover:border-white/20 hover:bg-[#222227] hover:text-white"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/6">
                  <ArrowLeftRight className="size-5 text-zinc-300" />
                </span>

                <span className="flex-1">
                  <span className="block font-semibold">Đổi sản phẩm</span>
                  <span className="mt-1 block text-xs font-normal text-zinc-400">
                    Chấp thuận đổi sang sản phẩm khác
                  </span>
                </span>
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              Để sau
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
