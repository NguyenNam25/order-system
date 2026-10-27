import { XCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type OrderStatus = "PENDING" | "SHIPPING" | "COMPLETED" | string;

interface Props {
  status: OrderStatus;
  onCancel: () => void;
  onReturn: () => void;
  onCompleted: () => void;
}

export default function OrderDetailActions({
  status,
  onCancel,
  onReturn,
  onCompleted,
}: Props) {
  if (status !== "PENDING" && status !== "SHIPPING" && status !== "COMPLETED") {
    return null;
  }

  return (
    <>
      <Separator className="bg-white/8" />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {status === "PENDING" && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <XCircle className="mr-2 size-4" />
            Hủy đơn hàng
          </Button>
        )}

        {status === "SHIPPING" && (
          <Button
            onClick={onCompleted}
            className="bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <CheckCircle2 className="mr-2 size-4" />
            Xác nhận đã nhận hàng
          </Button>
        )}

        {status === "COMPLETED" && (
          <Button
            onClick={onReturn}
            className="bg-[#FF0033] text-white hover:bg-[#D9002B]"
          >
            <RotateCcw className="mr-2 size-4" />
            Yêu cầu hoàn hàng
          </Button>
        )}
      </div>
    </>
  );
}
