import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

interface CheckoutPaymentMethodProps {
  isPending: boolean;
  isDisabled?: boolean;
}

export default function CheckoutPaymentMethod({
  isPending,
  isDisabled = false,
}: CheckoutPaymentMethodProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-950 text-white">
      <CardContent className="space-y-4 p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <CreditCard className="h-5 w-5 text-[#FF0033]" />
          Phương thức thanh toán
        </h2>

        <div className="flex items-start gap-3 rounded-lg border border-[#FF0033]/40 bg-[#FF0033]/5 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF0033]" />

          <div className="space-y-1">
            <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
            <p className="text-sm text-zinc-400">
              Bạn thanh toán trực tiếp cho đơn vị vận chuyển khi nhận hàng.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Kiểm tra thông tin đơn hàng trước khi xác nhận.
        </div>

        <Button
          type="submit"
          disabled={isDisabled || isPending}
          className="h-12 w-full bg-[#FF0033] font-semibold text-white hover:bg-[#D9002B] disabled:opacity-50"
        >
          {isPending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Xác nhận đặt hàng"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
