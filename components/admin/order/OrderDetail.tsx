"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/interfaces/order";
import { useState } from "react";
import CancelOrderDialog from "@/components/orders/CancelOrderDialog";
import ReturnApproveDialog from "@/components/orders/ReturnApproved";
import ReturnRejectDialog from "@/components/orders/ReturnRejected";
import useUpdateOrderStatus from "@/hooks/orders/mutations/useUpdateOrderStatus";
import OrderSummary from "./detail/OrderSummary";
import OrderItems from "./detail/OrderItems";
import ShippingInfo from "./detail/ShippingInfo";
import OrderNotes from "./detail/OrderNotes";
import OrderStatusActions from "./detail/OrderStatusActions";
import { toast } from "sonner";

interface OrderDetailProps {
  data: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderDetail({
  data,
  open,
  onOpenChange,
}: OrderDetailProps) {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openApproveReturn, setOpenApproveReturn] = useState(false);
  const [openRejectReturn, setOpenRejectReturn] = useState(false);

  const handleChangeStatus = useUpdateOrderStatus();

  const onUpdateOrderSuccess = (
    status: Order["status"],
    payload?: {
      returnMethod?: "REFUND" | "EXCHANGE";
    },
  ) => {
    switch (status) {
      case "CANCELLED":
        toast.success("Hủy đơn hàng thành công");
        setOpenCancelDialog(false);
        break;

      case "CONFIRMED":
        toast.success("Xác nhận đơn hàng thành công");
        break;

      case "SHIPPING":
        toast.success("Xác nhận đơn hàng đang được giao");
        setOpenApproveReturn(false);
        break;

      case "RETURN_APPROVED":
        if (payload?.returnMethod === "REFUND") {
          toast.success("Đã duyệt yêu cầu hoàn tiền thành công");
        } else if (payload?.returnMethod === "EXCHANGE") {
          toast.success("Đã duyệt yêu cầu đổi hàng thành công");
        } else {
          toast.success("Duyệt yêu cầu hoàn hàng thành công");
        }
        setOpenApproveReturn(false);
        break;

      case "RETURN_REJECTED":
        toast.success("Xác nhận hàng không thể hoàn");
        setOpenRejectReturn(false);
        break;

      default:
        toast.success("Cập nhật đơn hàng thành công");
        break;
    }
    onOpenChange(false);
  };

  const updateStatus = (
    status: Order["status"],
    payload?: {
      cancelNote?: string;
      returnMethod?: "REFUND" | "EXCHANGE";
      returnRejectNote?: string;
    },
  ) => {
    handleChangeStatus.mutate(
      {
        id: data.id,
        status,
        data: payload,
      },
      {
        onSuccess: () => onUpdateOrderSuccess(status, payload),
      },
    );
  };

  const onCancel = (cancelNote: string) => {
    updateStatus("CANCELLED", { cancelNote });
  };

  const onApproveReturn = (returnMethod: "REFUND" | "EXCHANGE") => {
    updateStatus("RETURN_APPROVED", { returnMethod });
  };

  const onRejectReturn = (returnRejectNote: string) => {
    updateStatus("RETURN_REJECTED", { returnRejectNote });
  };

  const hasNotes = Boolean(
    data.cancelNote?.trim() ||
    data.returnNote?.trim() ||
    data.returnRejectNote?.trim(),
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl! gap-6 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-xl">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Chi tiết đơn hàng
            </DialogTitle>

            <DialogDescription className="text-sm leading-5 text-muted-foreground">
              Xem thông tin sản phẩm, giao hàng và cập nhật trạng thái đơn hàng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <OrderSummary order={data} />

            <Separator />

            <OrderItems order={data} />

            <Separator />

            <ShippingInfo order={data} />

            {hasNotes && (
              <>
                <Separator />
                <OrderNotes order={data} />
              </>
            )}

            <Separator />

            <OrderStatusActions
              order={data}
              isPending={handleChangeStatus.isPending}
              onConfirm={() => updateStatus("CONFIRMED")}
              onShipping={() => updateStatus("SHIPPING")}
              onComplete={() => updateStatus("COMPLETED")}
              onOpenCancelDialog={() => setOpenCancelDialog(true)}
              onOpenApproveReturn={() => setOpenApproveReturn(true)}
              onOpenRejectReturn={() => setOpenRejectReturn(true)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <CancelOrderDialog
        open={openCancelDialog}
        onOpenChange={setOpenCancelDialog}
        order={data}
        onSubmit={onCancel}
      />

      <ReturnApproveDialog
        open={openApproveReturn}
        onOpenChange={setOpenApproveReturn}
        order={data}
        onSubmit={onApproveReturn}
      />

      <ReturnRejectDialog
        open={openRejectReturn}
        onOpenChange={setOpenRejectReturn}
        order={data}
        onSubmit={onRejectReturn}
      />
    </>
  );
}
