import Image from "next/image";
import { Package, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/interfaces/order";
import { formatVND } from "@/lib/format";

interface Props {
  order: Order;
}

export default function OrderProducts({ order }: Props) {
  return (
    <>
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
                <div className="flex size-17 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/6 bg-[#222227] sm:size-20">
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
                  <p className="mt-1 text-xs text-zinc-500">/ sản phẩm</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-[#FF0033]/20 bg-[#FF0033]/6 p-4">
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

      <Separator className="bg-white/8" />
    </>
  );
}
