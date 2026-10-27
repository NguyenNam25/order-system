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

  const updateStatus = (
    status: Order["status"],
    payload?: UpdateOrderStatusPayload["data"],
  ) => {
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
        if (payload?.returnMethod === "REFUND") {
          successMessage = "Đã duyệt yêu cầu hoàn tiền thành công";
        } else if (payload?.returnMethod === "EXCHANGE") {
          successMessage = "Đã duyệt yêu cầu đổi hàng thành công";
        } else {
          successMessage = "Duyệt yêu cầu hoàn hàng thành công";
        }
        break;

      case "RETURN_REJECTED":
        successMessage = "Xác nhận hàng không thể hoàn";
        break;

      default:
        successMessage = "Cập nhật đơn hàng thành công";
        break;
    }

    handleChangeStatus.mutate({
      id: data.id,
      status,
      data: payload,
      successMessage,
    });

    // Đóng dialog tương ứng sau khi gửi yêu cầu.
    // Nếu API thất bại, hook sẽ hiển thị toast lỗi.
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
