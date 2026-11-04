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
import useUpdateOrderStatus, {
  type UpdateOrderStatusPayload,
} from "@/hooks/orders/mutations/useUpdateOrderStatus";
import OrderSummary from "./detail/OrderSummary";
import OrderItems from "./detail/OrderItems";
import ShippingInfo from "./detail/ShippingInfo";
import OrderNotes from "./detail/OrderNotes";
import OrderStatusActions from "./detail/OrderStatusActions";

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

  const updateStatus = async (
    status: Order["status"],
    payload?: UpdateOrderStatusPayload["data"],
  ): Promise<boolean> => {
    let successMessage: string;

    switch (status) {
      case "CANCELLED":
        successMessage = "Hủy đơn hàng thành công";
        break;
      case "CONFIRMED":
        successMessage = "Xác nhận đơn hàng thành công";
        break;
      case "SHIPPING":
        successMessage = "Xác nhận đơn hàng đang được giao";
        break;
      case "COMPLETED":
        successMessage = "Xác nhận giao hàng thành công";
        break;
      case "RETURN_APPROVED":
        successMessage =
          payload?.returnMethod === "REFUND"
            ? "Đã duyệt yêu cầu hoàn tiền thành công"
            : payload?.returnMethod === "EXCHANGE"
              ? "Đã duyệt yêu cầu đổi hàng thành công"
              : "Duyệt yêu cầu hoàn hàng thành công";
        break;
      case "RETURN_REJECTED":
        successMessage = "Xác nhận hàng không thể hoàn";
        break;
      default:
        successMessage = "Cập nhật đơn hàng thành công";
        break;
    }

    try {
      await handleChangeStatus.mutateAsync({
        id: data.id,
        status,
        data: payload,
        successMessage,
      });

      switch (status) {
        case "CANCELLED":
          setOpenCancelDialog(false);
          break;
        case "RETURN_APPROVED":
          setOpenApproveReturn(false);
          break;
        case "RETURN_REJECTED":
          setOpenRejectReturn(false);
          break;
      }

      onOpenChange(false);
      return true;
    } catch {
      setOpenCancelDialog(false);
      setOpenApproveReturn(false);
      setOpenRejectReturn(false);
      onOpenChange(false);
      return false;
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (handleChangeStatus.isPending && !nextOpen) return;
    onOpenChange(nextOpen);
  };

  const handleNestedOpenChange =
    (setOpen: (open: boolean) => void) => (nextOpen: boolean) => {
      if (handleChangeStatus.isPending && !nextOpen) return;
      setOpen(nextOpen);
    };

  const onCancel = (cancelNote: string) =>
    updateStatus("CANCELLED", { cancelNote });

  const onApproveReturn = (returnMethod: "REFUND" | "EXCHANGE") =>
    updateStatus("RETURN_APPROVED", { returnMethod });

  const onRejectReturn = (returnRejectNote: string) =>
    updateStatus("RETURN_REJECTED", { returnRejectNote });

  const hasNotes = Boolean(
    data.cancelNote?.trim() ||
    data.returnNote?.trim() ||
    data.returnRejectNote?.trim(),
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl! gap-6 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-xl admin-order-detail-scroll">
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
        onOpenChange={handleNestedOpenChange(setOpenCancelDialog)}
        order={data}
        onSubmit={onCancel}
        isPending={handleChangeStatus.isPending}
      />

      <ReturnApproveDialog
        open={openApproveReturn}
        onOpenChange={handleNestedOpenChange(setOpenApproveReturn)}
        order={data}
        onSubmit={onApproveReturn}
        isPending={handleChangeStatus.isPending}
      />

      <ReturnRejectDialog
        open={openRejectReturn}
        onOpenChange={handleNestedOpenChange(setOpenRejectReturn)}
        order={data}
        onSubmit={onRejectReturn}
        isPending={handleChangeStatus.isPending}
      />
    </>
  );
}
