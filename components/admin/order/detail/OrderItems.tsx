import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/interfaces/order";
import { formatVND } from "@/lib/format";

interface OrderItemsProps {
  order: Order;
}

export default function OrderItems({ order }: OrderItemsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Sản phẩm đã đặt</h3>
        <span className="text-xs text-muted-foreground">
          {order.items.length} sản phẩm
        </span>
      </div>

      <div className="space-y-3">
        {order.items.map((item) => (
          <Card
            key={item.id}
            className="rounded-xl border-border py-3 shadow-none"
          >
            <CardContent className="flex items-center gap-3 px-3 sm:gap-4 sm:px-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30">
                {item.product.images?.[0]?.imageUrl ? (
                  <Image
                    src={item.product.images[0].imageUrl}
                    alt={item.product.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-center text-xs text-muted-foreground">
                    Không có ảnh
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <p className="line-clamp-2 text-sm font-medium leading-5">
                  {item.product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Số lượng: {item.quantity}
                </p>
              </div>

              <p className="shrink-0 text-right text-sm font-semibold tabular-nums text-primary">
                {formatVND(item.priceAtPurchase)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-4">
        <span className="text-sm font-medium text-muted-foreground">
          Tổng thanh toán
        </span>
        <span className="text-lg font-semibold tabular-nums text-primary">
          {formatVND(order.total)}
        </span>
      </div>
    </section>
  );
}
