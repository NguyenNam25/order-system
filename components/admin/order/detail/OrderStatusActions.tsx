import { Button } from "@/components/ui/button";
import type { Order } from "@/interfaces/order";
import { Check, Truck, X, RotateCcw, CircleCheck } from "lucide-react";

interface OrderStatusActionsProps {
  order: Order;
  isPending: boolean;
  isOutOfStock?: boolean;
  onConfirm: () => void;
  onShipping: () => void;
  onComplete: () => void;
  onOpenCancelDialog: () => void;
  onOpenApproveReturn: () => void;
  onOpenRejectReturn: () => void;
}

export default function OrderStatusActions({
  order,
  isPending,
  isOutOfStock = false,
  onConfirm,
  onShipping,
  onComplete,
  onOpenCancelDialog,
  onOpenApproveReturn,
  onOpenRejectReturn,
}: OrderStatusActionsProps) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {order.status === "PENDING" && (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onOpenCancelDialog}
            disabled={isPending}
          >
            <X className="mr-2 size-4" />
            Hủy đơn hàng
          </Button>

          <Button type="button" onClick={onConfirm} disabled={isPending}>
            <Check className="mr-2 size-4" />
            Xác nhận đơn hàng
          </Button>
        </>
      )}

      {order.status === "CONFIRMED" && (
        <Button type="button" onClick={onShipping} disabled={isPending}>
          <Truck className="mr-2 size-4" />
          {isPending ? "Đang xử lý..." : "Xác nhận đang giao hàng"}
        </Button>
      )}

      {order.status === "SHIPPING" && (
        <Button type="button" onClick={onComplete} disabled={isPending}>
          <CircleCheck className="mr-2 size-4" />
          {isPending ? "Đang xử lý..." : "Xác nhận đã giao hàng"}
        </Button>
      )}

      {order.status === "RETURN_REQUESTED" && (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onOpenRejectReturn}
            disabled={isPending}
          >
            <X className="mr-2 size-4" />
            Từ chối trả hàng
          </Button>

          <Button
            type="button"
            onClick={onOpenApproveReturn}
            disabled={isPending}
          >
            <RotateCcw className="mr-2 size-4" />
            Duyệt trả hàng
          </Button>
        </>
      )}
    </div>
  );
}
