"use client";

import { RotateCcw, Package, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Order } from "@/interfaces/order";
import { useForm } from "react-hook-form";

interface ReturnOrderForm {
  returnNote: string;
}

interface ReturnOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (returnNote: string) => void;
}

export default function ReturnOrderDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: ReturnOrderDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReturnOrderForm>();

  const handleFormSubmit = (values: ReturnOrderForm) => {
    onSubmit(values.returnNote.trim());
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);

        if (!nextOpen) {
          reset();
        }
      }}
    >
      <DialogContent className="w-[calc(100%-24px)] max-w-md gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#101013] p-0 text-zinc-100">
        {/* Header */}
        <div className="border-b border-white/[0.07] bg-gradient-to-r from-[#FF0033]/10 via-transparent to-transparent px-5 py-5 sm:px-6">
          <DialogHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-[#FF0033]/20 bg-[#FF0033]/10">
              <RotateCcw className="size-5 text-[#FF4D6D]" />
            </div>

            <DialogTitle className="text-lg font-bold text-white">
              Yêu cầu hoàn hàng
            </DialogTitle>

            <DialogDescription className="mt-2 text-sm leading-6 text-zinc-400">
              Vui lòng cung cấp lý do hoàn hàng để cửa hàng xem xét yêu cầu
              của bạn.
            </DialogDescription>
          </DialogHeader>
        </div>

        {order && (
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-5 p-5 sm:p-6"
          >
            {/* Order information */}
            <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-[#18181C] p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                <Package className="size-5 text-zinc-300" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-zinc-500">Mã đơn hàng</p>
                <p className="mt-1 break-all text-sm font-semibold text-zinc-100">
                  {order.orderCode}
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Yêu cầu sẽ được gửi đến cửa hàng để xem xét.
                </p>
              </div>
            </div>

            {/* Return reason */}
            <Field>
              <FieldLabel
                htmlFor="return-note"
                className="text-sm font-medium text-zinc-200"
              >
                Lý do hoàn hàng
                <span className="ml-1 text-red-400">*</span>
              </FieldLabel>

              <Input
                {...register("returnNote", {
                  required: "Vui lòng nhập lý do hoàn hàng",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Lý do hoàn hàng không được để trống",
                })}
                id="return-note"
                type="text"
                placeholder="Ví dụ: Sản phẩm bị lỗi, sai mẫu..."
                aria-invalid={!!errors.returnNote}
                className="h-11 rounded-xl border-white/10 bg-[#18181C] text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#FF0033]/50 focus-visible:ring-[#FF0033]/20"
              />

              {errors.returnNote && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.returnNote.message}
                </p>
              )}
            </Field>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.06] hover:text-white"
              >
                Đóng
              </Button>

              <Button
                type="submit"
                className="rounded-xl bg-[#FF0033] font-semibold text-white hover:bg-[#D9002B]"
              >
                <Send className="mr-2 size-4" />
                Gửi yêu cầu
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
