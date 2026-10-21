
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/format";
import { ShoppingBag, Truck } from "lucide-react";

interface CheckoutOrderSummaryProps {
  totalQuantity: number;
  cartTotal: number;
}

export default function CheckoutOrderSummary({
  totalQuantity,
  cartTotal,
}: CheckoutOrderSummaryProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-950 text-white">
      <CardContent className="space-y-4 p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ShoppingBag className="h-5 w-5 text-[#FF0033]" />
          Tóm tắt đơn hàng
        </h2>

        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">
            Số lượng sản phẩm
          </span>
          <span>{totalQuantity}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Tạm tính</span>
          <span>{formatVND(cartTotal)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-400">
            <Truck className="h-4 w-4" />
            Phí vận chuyển
          </span>
          <span className="font-medium text-emerald-400">
            Miễn phí
          </span>
        </div>

        <Separator className="bg-zinc-800" />

        <div className="flex items-center justify-between gap-4">
          <span className="font-semibold">Tổng thanh toán</span>
          <span className="text-xl font-bold text-[#FF0033]">
            {formatVND(cartTotal)}
          </span>
        </div>

        <p className="text-xs text-zinc-500">
          Giá sản phẩm đã bao gồm các khoản thuế áp dụng (nếu có).
        </p>
      </CardContent>
    </Card>
  );
}
