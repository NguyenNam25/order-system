"use client";

import Image from "next/image";
import {
  Package,
  MapPin,
  CalendarDays,
  CreditCard,
  XCircle,
  CheckCircle2,
  RotateCcw,
  UserRound,
  Phone,
  Receipt,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Order } from "@/interfaces/order";
import { formatDate, formatVND } from "@/lib/format";

interface OrderDetailDialogProps {
  order: Order | null;
  onClose: () => void;
  onCancel: () => void;
  onReturn: () => void;
  onCompleted: () => void;
}

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-400",
  },
  SHIPPING: {
    label: "Đang giao hàng",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-400",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "border-red-500/20 bg-red-500/10 text-red-400",
  },
  RETURN_REQUESTED: {
    label: "Yêu cầu hoàn hàng",
    className: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  },
  RETURN_APPROVED: {
    label: "Đã duyệt hoàn hàng",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  RETURN_REJECTED: {
    label: "Từ chối hoàn hàng",
    className: "border-red-500/20 bg-red-500/10 text-red-400",
  },
};

export default function OrderDetail({
  order,
  onClose,
  onCancel,
  onReturn,
  onCompleted,
}: OrderDetailDialogProps) {
  const status = order ? statusConfig[order.status] : undefined;

  return (
    <Dialog
      open={order !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] w-[calc(100%-24px)] max-w-2xl gap-0 overflow-y-auto border border-white/10 bg-[#101013] p-0 text-zinc-100 sm:rounded-2xl">
        {order && (
          <>
            {/* Header */}
            <div className="border-b border-white/[0.07] bg-gradient-to-r from-[#FF0033]/10 via-transparent to-transparent px-5 py-5 sm:px-6">
              <DialogHeader>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-[#FF0033]/20 bg-[#FF0033]/10">
                    <Package className="size-5 text-[#FF4D6D]" />
                  </div>

                  <div>
                    <DialogTitle className="text-lg font-bold text-white sm:text-xl">
                      Chi tiết đơn hàng
                    </DialogTitle>
                    <p className="mt-1 text-xs text-zinc-500">
                      Thông tin sản phẩm và giao hàng
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                  <div className="min-w-0">
                    <p className="mb-1 text-xs text-zinc-500">Mã đơn hàng</p>
                    <p className="break-all font-semibold text-zinc-200">
                      {order.orderCode}
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      status?.className ??
                      "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                    }`}
                  >
                    {status?.label ?? order.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                  <CalendarDays className="size-4 text-zinc-500" />
                  <span>Ngày đặt:</span>
                  <span className="text-zinc-200">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </DialogHeader>
            </div>

            <div className="space-y-6 px-5 py-5 sm:px-6">
              {/* Products */}
              <section>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 font-semibold text-white">
                    <Package className="size-4 text-[#FF4D6D]" />
                    Sản phẩm
                  </h3>
                  <span className="text-xs text-zinc-500">
                    {order.items.length} sản phẩm
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <Card
                      key={item.id}
                      className="rounded-xl border border-white/[0.07] bg-[#18181C] py-3 shadow-none"
                    >
                      <CardContent className="flex items-center gap-3 px-3 sm:gap-4 sm:px-4">
                        <div className="flex size-[68px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-[#222227] sm:size-20">
                          {item.product.images?.[0]?.imageUrl ? (
                            <Image
                              src={item.product.images[0].imageUrl}
                              alt={item.product.name}
                              width={80}
                              height={80}
                              className="size-full object-contain p-1"
                            />
                          ) : (
                            <Package className="size-7 text-zinc-600" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium leading-5 text-zinc-100 sm:text-base">
                            {item.product.name}
                          </p>
                          <p className="mt-2 text-xs text-zinc-500">
                            Số lượng:{" "}
                            <span className="font-medium text-zinc-300">
                              {item.quantity}
                            </span>
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-[#FF4D6D] sm:text-base">
                            {formatVND(item.priceAtPurchase)}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            / sản phẩm
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-[#FF0033]/20 bg-[#FF0033]/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-zinc-300">
                      <Receipt className="size-4 text-[#FF4D6D]" />
                      Tổng thanh toán
                    </span>
                    <span className="text-xl font-bold text-[#FF4D6D] sm:text-2xl">
                      {formatVND(order.total)}
                    </span>
                  </div>
                </div>
              </section>

              <Separator className="bg-white/[0.08]" />

              {/* Shipping information */}
              <section>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                  <MapPin className="size-4 text-[#FF4D6D]" />
                  Thông tin giao hàng
                </h3>

                <div className="space-y-4 rounded-xl border border-white/[0.07] bg-[#18181C] p-4">
                  <div className="flex items-start gap-3">
                    <UserRound className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-500">Người nhận</p>
                      <p className="mt-1 break-words text-sm font-medium text-zinc-200">
                        {order.receiverName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-500">Số điện thoại</p>
                      <p className="mt-1 break-words text-sm text-zinc-200">
                        {order.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-500">Địa chỉ nhận hàng</p>
                      <p className="mt-1 break-words text-sm leading-6 text-zinc-200">
                        {order.address}
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-white/[0.07]" />

                  <div className="flex items-center gap-3">
                    <CreditCard className="size-4 shrink-0 text-zinc-500" />
                    <div>
                      <p className="text-xs text-zinc-500">
                        Phương thức thanh toán
                      </p>
                      <p className="mt-1 text-sm text-zinc-200">
                        Thanh toán khi nhận hàng (COD)
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Notes */}
              {(order.cancelNote ||
                order.returnNote ||
                order.returnRejectNote) && (
                <>
                  <Separator className="bg-white/[0.08]" />

                  <section className="space-y-3">
                    <h3 className="font-semibold text-white">
                      Ghi chú đơn hàng
                    </h3>

                    {order.cancelNote && (
                      <div className="rounded-lg border border-red-500/15 bg-red-500/[0.06] p-3">
                        <p className="mb-1 text-xs font-semibold text-red-400">
                          Lý do hủy đơn
                        </p>
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-300">
                          {order.cancelNote}
                        </p>
                      </div>
                    )}

                    {order.returnNote && (
                      <div className="rounded-lg border border-orange-500/15 bg-orange-500/[0.06] p-3">
                        <p className="mb-1 text-xs font-semibold text-orange-400">
                          Lý do hoàn hàng
                        </p>
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-300">
                          {order.returnNote}
                        </p>
                      </div>
                    )}

                    {order.returnRejectNote && (
                      <div className="rounded-lg border border-red-500/15 bg-red-500/[0.06] p-3">
                        <p className="mb-1 text-xs font-semibold text-red-400">
                          Lý do từ chối hoàn hàng
                        </p>
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-300">
                          {order.returnRejectNote}
                        </p>
                      </div>
                    )}
                  </section>
                </>
              )}

              {/* Actions */}
              {(order.status === "PENDING" ||
                order.status === "SHIPPING" ||
                order.status === "COMPLETED") && (
                <>
                  <Separator className="bg-white/[0.08]" />

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    {order.status === "PENDING" && (
                      <Button
                        variant="outline"
                        onClick={onCancel}
                        className="border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <XCircle className="mr-2 size-4" />
                        Hủy đơn hàng
                      </Button>
                    )}

                    {order.status === "SHIPPING" && (
                      <Button
                        onClick={onCompleted}
                        className="bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        <CheckCircle2 className="mr-2 size-4" />
                        Xác nhận đã nhận hàng
                      </Button>
                    )}

                    {order.status === "COMPLETED" && (
                      <Button
                        onClick={onReturn}
                        className="bg-[#FF0033] text-white hover:bg-[#D9002B]"
                      >
                        <RotateCcw className="mr-2 size-4" />
                        Yêu cầu hoàn hàng
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
