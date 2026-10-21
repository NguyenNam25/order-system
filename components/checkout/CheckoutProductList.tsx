
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Cart } from "@/interfaces/cart";
import { formatVND } from "@/lib/format";

interface CheckoutProductListProps {
  items: NonNullable<Cart>["items"];
}

export default function CheckoutProductList({
  items,
}: CheckoutProductListProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-xl border-white/[0.07] bg-[#18181B] py-0 text-zinc-100">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#FF0033]/10">
          <ShoppingBag className="size-5 text-[#FF334F]" />
        </div>

        <div>
          <h2 className="font-semibold">Sản phẩm đã chọn</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {items.length} sản phẩm trong đơn hàng
          </p>
        </div>
      </div>

      <CardContent className="px-4 py-2 sm:px-6">
        <div className="divide-y divide-white/[0.06]">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-4 sm:gap-5"
            >
              <div className="flex size-[76px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-[#242429] sm:size-[92px]">
                {item.product.images?.[0]?.imageUrl ? (
                  <Image
                    src={item.product.images[0].imageUrl}
                    alt={item.product.name}
                    width={92}
                    height={92}
                    className="size-full object-contain p-2"
                  />
                ) : (
                  <ShoppingBag className="size-7 text-zinc-600" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium leading-5 text-zinc-100 sm:text-base">
                  {item.product.name}
                </h3>

                <p className="mt-2 text-xs text-zinc-500">
                  Số lượng: {item.quantity}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-[#FF334F] sm:text-base">
                  {formatVND(item.product.price * item.quantity)}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {formatVND(item.product.price)}/sp
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
