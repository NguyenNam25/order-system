
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/interfaces/order";

interface ShippingInfoProps {
  order: Order;
}

export default function ShippingInfo({ order }: ShippingInfoProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">
        Thông tin giao hàng
      </h3>

      <div className="rounded-xl border border-border p-4">
        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <span className="text-sm text-muted-foreground">
              Người nhận
            </span>
            <span className="text-sm font-medium sm:max-w-[65%] sm:text-right">
              {order.receiverName || "Chưa có thông tin"}
            </span>
          </div>

          <Separator />

          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <span className="text-sm text-muted-foreground">
              Số điện thoại
            </span>
            <span className="text-sm font-medium sm:text-right">
              {order.phone || "Chưa có thông tin"}
            </span>
          </div>

          <Separator />

          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <span className="text-sm text-muted-foreground">
              Địa chỉ giao hàng
            </span>
            <span className="text-sm font-medium wrap-break-word sm:max-w-[65%] sm:text-right">
              {order.address || "Chưa có thông tin"}
            </span>
          </div>

          <Separator />

          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <span className="text-sm text-muted-foreground">
              Phương thức thanh toán
            </span>
            <span className="text-sm font-medium sm:text-right">
              Thanh toán khi nhận hàng
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
