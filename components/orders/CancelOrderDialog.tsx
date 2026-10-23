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

interface CancelOrderForm {
  cancelNote: string;
}

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (cancelNote: string) => void;
}

export default function CancelOrderDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: CancelOrderDialogProps) {
  const { register, handleSubmit, reset } = useForm<CancelOrderForm>();

  const handleFormSubmit = (values: CancelOrderForm) => {
    onSubmit(values.cancelNote);
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
        <div className="border-b border-white/[0.07] bg-gradient-to-r from-red-500/10 via-transparent to-transparent px-5 py-5 sm:px-6">
          <DialogHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
              <AlertTriangle className="size-5 text-red-400" />
            </div>

            <DialogTitle className="text-lg font-bold text-white">
              Xác nhận hủy đơn hàng?
            </DialogTitle>

            <DialogDescription className="mt-2 text-sm leading-6 text-zinc-400">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Vui lòng cho biết
              lý do để tiếp tục.
            </DialogDescription>
          </DialogHeader>
        </div>

        {order && (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 p-5 sm:p-6">
            <div className="rounded-xl border border-white/[0.07] bg-[#18181C] p-3">
              <p className="text-xs text-zinc-500">Mã đơn hàng</p>
              <p className="mt-1 break-all text-sm font-semibold text-zinc-200">
                {order.orderCode}
              </p>
            </div>

            <Field>
              <FieldLabel
                htmlFor="cancel-note"
                className="text-sm font-medium text-zinc-200"
              >
                Lý do hủy đơn hàng
                <span className="ml-1 text-red-400">*</span>
              </FieldLabel>

              <Input
                {...register("cancelNote", {
                  required: "Vui lòng nhập lý do hủy đơn hàng",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Lý do hủy đơn hàng không được để trống",
                })}
                id="cancel-note"
                type="text"
                placeholder="Nhập lý do bạn muốn hủy đơn..."
                className="h-11 rounded-xl border-white/10 bg-[#18181C] text-sm text-white placeholder:text-zinc-500 focus-visible:border-red-500/50 focus-visible:ring-red-500/20"
                required
              />
              <p className="mt-1 text-xs text-zinc-500">
                Thông tin này sẽ được lưu cùng đơn hàng.
              </p>
            </Field>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.06] hover:text-white"
              >
                Giữ đơn hàng
              </Button>

              <Button
                type="submit"
                variant="destructive"
                className="rounded-xl bg-[#FF0033] font-semibold text-white hover:bg-[#D9002B]"
              >
                <XCircle className="mr-2 size-4" />
                Xác nhận hủy
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
