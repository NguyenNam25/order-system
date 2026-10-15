
import { Order } from "@/interfaces/order";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatVND } from "@/lib/format";
import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Package,
} from "lucide-react";
import Image from "next/image";

interface OrderListProps {
  orders: Order[];
  onSelect: (order: Order) => void;
  value: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  },
  SHIPPING: {
    label: "Đang giao hàng",
    className: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  },
  COMPLETED: {
    label: "Đã giao",
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "border-red-400/20 bg-red-400/10 text-red-300",
  },
  RETURN_REQUESTED: {
    label: "Chờ xử lý trả hàng",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },
  RETURN_APPROVED: {
    label: "Đã chấp nhận trả hàng",
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
  RETURN_REJECTED: {
    label: "Từ chối trả hàng",
    className: "border-red-400/20 bg-red-400/10 text-red-300",
  },
};

export default function OrderList({
  orders,
  onSelect,
  value,
}: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#111114] px-5 py-14 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#242429]">
          <ClipboardList className="size-8 text-zinc-500" />
        </div>

        <h3 className="font-semibold text-zinc-200">
          Chưa có đơn hàng
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
          Bạn chưa có đơn hàng nào trong mục này. Các đơn hàng phù hợp sẽ xuất
          hiện tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => {
        const { items } = order;

        const totalQuantity = items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        const status = statusConfig[order.status] ?? {
          label: order.status,
          className: "border-white/10 bg-white/5 text-zinc-300",
        };

        return (
          <Card
            key={order.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(order)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(order);
              }
            }}
            className="cursor-pointer gap-0 overflow-hidden rounded-xl border-white/[0.07] bg-[#18181B] py-0 text-zinc-100 transition duration-200 hover:border-[#FF0033]/40 hover:bg-[#1D1D21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0033]/50"
          >
            {/* Header đơn hàng */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">Mã đơn hàng</p>
                <p className="mt-1 break-all text-sm font-semibold text-zinc-100">
                  {order.orderCode}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>

                <ChevronRight className="size-4 text-zinc-500" />
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <CardContent className="px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex min-w-0 items-center gap-3 sm:gap-4"
                  >
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-[#242429] sm:size-[72px]">
                      {item.product.images?.[0]?.imageUrl ? (
                        <Image
                          src={item.product.images[0].imageUrl}
                          alt={item.product.name}
                          width={72}
                          height={72}
                          className="size-full object-contain p-1.5"
                        />
                      ) : (
                        <Package className="size-6 text-zinc-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-medium leading-5 text-zinc-200">
                        {item.product.name}
                      </h3>

                      <p className="mt-1 text-xs text-zinc-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-right text-sm font-medium text-zinc-200">
                      {formatVND(item.priceAtPurchase)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer đơn hàng */}
              <div className="mt-5 flex flex-col gap-4 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    {formatDate(order.createdAt)}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Package className="size-3.5" />
                    {totalQuantity} sản phẩm
                  </span>

                  {value === "cancelled" && (
                    <span>
                      Người hủy:{" "}
                      <span className="text-zinc-300">{order.role}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="text-xs text-zinc-500">
                    Tổng thanh toán
                  </span>

                  <span className="text-lg font-bold text-[#FF334F]">
                    {formatVND(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
