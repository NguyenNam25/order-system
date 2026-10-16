import { Separator } from "@/components/ui/separator";
import type { Order } from "@/interfaces/order";
import { formatDate } from "@/lib/format";

interface OrderSummaryProps {
  order: Order;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Mã đơn hàng
          </p>
          <p className="text-base font-semibold">#{order.id}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Trạng thái
          </p>
          <span className="inline-flex rounded-md border border-border bg-background px-2.5 py-1 text-sm font-medium">
            {order.status}
          </span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          Ngày đặt hàng
        </p>
        <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
      </div>
    </div>
  );
}
