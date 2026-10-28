"use client";

import { AlertTriangle, XCircle } from "lucide-react";

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

interface ReturnRejectForm {
  returnRejectNote: string;
}

interface ReturnRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (returnRejectNote: string) => void;
}

export default function ReturnRejectDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: ReturnRejectDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReturnRejectForm>();

  const handleFormSubmit = (values: ReturnRejectForm) => {
    onSubmit(values.returnRejectNote.trim());
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
        <div className="border-b border-white/[0.07] bg-linear-to-r from-red-500/10 via-transparent to-transparent px-5 py-5 sm:px-6">
          <DialogHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
              <AlertTriangle className="size-5 text-red-400" />
            </div>

            <DialogTitle className="text-lg font-bold text-white">
              Từ chối yêu cầu hoàn hàng
            </DialogTitle>

            <DialogDescription className="mt-2 text-sm leading-6 text-zinc-400">
              Vui lòng nhập lý do từ chối để khách hàng hiểu rõ quyết định
              của cửa hàng.
            </DialogDescription>
          </DialogHeader>
        </div>

        {order && (
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-5 p-5 sm:p-6"
          >
            {/* Order information */}
            <div className="rounded-xl border border-white/[0.07] bg-[#18181C] p-4">
              <p className="text-xs text-zinc-500">Mã đơn hàng</p>
              <p className="mt-1 break-all text-sm font-semibold text-zinc-100">
                {order.orderCode}
              </p>
            </div>

            {/* Rejection reason */}
            <Field>
              <FieldLabel
                htmlFor="return-reject-note"
                className="text-sm font-medium text-zinc-200"
              >
                Lý do từ chối
                <span className="ml-1 text-red-400">*</span>
              </FieldLabel>

              <Input
                {...register("returnRejectNote", {
                  required: "Vui lòng nhập lý do từ chối",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Lý do từ chối không được để trống",
                })}
                id="return-reject-note"
                type="text"
                placeholder="Nhập lý do từ chối yêu cầu..."
                aria-invalid={!!errors.returnRejectNote}
                className="h-11 rounded-xl border-white/10 bg-[#18181C] text-sm text-white placeholder:text-zinc-500 focus-visible:border-red-500/50 focus-visible:ring-red-500/20"
              />

              {errors.returnRejectNote && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.returnRejectNote.message}
                </p>
              )}
            </Field>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl border-white/10 bg-transparent text-zinc-300 hover:bg-white/6 hover:text-white"
              >
                Quay lại
              </Button>

              <Button
                type="submit"
                variant="destructive"
                className="rounded-xl bg-[#FF0033] font-semibold text-white hover:bg-[#D9002B]"
              >
                <XCircle className="mr-2 size-4" />
                Xác nhận từ chối
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
