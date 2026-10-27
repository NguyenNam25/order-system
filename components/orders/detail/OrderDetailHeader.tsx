import { Package, CalendarDays } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Order } from "@/interfaces/order";
import { formatDate } from "@/lib/format";

interface Props {
  order: Order;
}

const statusConfig: Record<string, { label: string; className: string }> = {
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

export default function OrderDetailHeader({ order }: Props) {
  const status = statusConfig[order.status];

  return (
    <div className="border-b border-white/[0.07] bg-linear-to-r from-[#FF0033]/10 via-transparent to-transparent px-5 py-5 sm:px-6">
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

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/2.5 p-3">
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
          <span className="text-zinc-200">{formatDate(order.createdAt)}</span>
        </div>
      </DialogHeader>
    </div>
  );
}
