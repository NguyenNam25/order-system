import { MapPin, UserRound, Phone, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/interfaces/order";

interface Props {
  order: Order;
}

export default function OrderShippingInfo({ order }: Props) {
  return (
    <>
      <section>
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
          <MapPin className="size-4 text-[#FF4D6D]" />
          Thông tin giao hàng
        </h3>

        <Card className="rounded-xl border border-white/[0.07] bg-[#18181C] py-0 shadow-none">
          <CardContent className="space-y-4 p-4">
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 size-4 shrink-0 text-zinc-500" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">Người nhận</p>
                <p className="mt-1 wrap-break-word text-sm font-medium text-zinc-200">
                  {order.receiverName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-zinc-500" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">Số điện thoại</p>
                <p className="mt-1 wrap-break-word text-sm text-zinc-200">
                  {order.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-500" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">Địa chỉ nhận hàng</p>
                <p className="mt-1 wrap-break-word text-sm leading-6 text-zinc-200">
                  {order.address}
                </p>
              </div>
            </div>

            <Separator className="bg-white/[0.07]" />

            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-zinc-500" />
              <div>
                <p className="text-xs text-zinc-500">Phương thức thanh toán</p>
                <p className="mt-1 text-sm text-zinc-200">
                  Thanh toán khi nhận hàng (COD)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="bg-white/8" />
    </>
  );
}
