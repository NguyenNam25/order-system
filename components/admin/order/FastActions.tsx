"use client";

import { useState } from "react";
import type { Order } from "@/interfaces/order";
import CancelOrderDialog from "@/components/orders/CancelOrderDialog";
import ReturnApproveDialog from "@/components/orders/ReturnApproved";
import ReturnRejectDialog from "@/components/orders/ReturnRejected";
import OrderStatusActions from "./detail/OrderStatusActions";
import useUpdateOrderStatus, {
  UpdateOrderStatusPayload,
} from "@/hooks/orders/mutations/useUpdateOrderStatus";

interface FastActionsProps {
  order: Order;
}

export default function FastActions({ order }: FastActionsProps) {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openApproveReturn, setOpenApproveReturn] = useState(false);
  const [openRejectReturn, setOpenRejectReturn] = useState(false);

  const handleChangeStatus = useUpdateOrderStatus();

  const isOutOfStock = order.items.some(
    (item) => item.quantity > item.product.quantity,
  );

  const handleStatusChange = (
    status: Order["status"],
    data?: UpdateOrderStatusPayload["data"],
  ) => {
    const messages: Partial<Record<Order["status"], string>> = {
      CANCELLED: "Hủy đơn hàng thành công",
      CONFIRMED: "Xác nhận đơn hàng thành công",
      SHIPPING: "Xác nhận đơn hàng đang được giao",
      COMPLETED: "Xác nhận giao hàng thành công",
      RETURN_REJECTED: "Đã từ chối yêu cầu hoàn hàng",
    };

    let successMessage = messages[status];

    if (status === "RETURN_APPROVED") {
      successMessage =
        data?.returnMethod === "REFUND"
          ? "Đã duyệt yêu cầu hoàn tiền"
          : data?.returnMethod === "EXCHANGE"
            ? "Đã duyệt yêu cầu đổi hàng"
            : "Đã duyệt yêu cầu hoàn hàng";
    }

    handleChangeStatus.mutate({
      id: order.id,
      status,
      data,
      successMessage,
    });

    if (status === "CANCELLED") {
      setOpenCancelDialog(false);
    }

    if (status === "RETURN_APPROVED") {
      setOpenApproveReturn(false);
    }

    if (status === "RETURN_REJECTED") {
      setOpenRejectReturn(false);
    }
  };

  return (
    <>
      <CancelOrderDialog
        open={openCancelDialog}
        onOpenChange={setOpenCancelDialog}
        order={order}
        onSubmit={(cancelNote) =>
          handleStatusChange("CANCELLED", { cancelNote })
        }
      />

      <ReturnApproveDialog
        open={openApproveReturn}
        onOpenChange={setOpenApproveReturn}
        order={order}
        onSubmit={(returnMethod) =>
          handleStatusChange("RETURN_APPROVED", { returnMethod })
        }
      />

      <ReturnRejectDialog
        open={openRejectReturn}
        onOpenChange={setOpenRejectReturn}
        order={order}
        onSubmit={(returnRejectNote) =>
          handleStatusChange("RETURN_REJECTED", {
            returnRejectNote,
          })
        }
      />

      <OrderStatusActions
        order={order}
        isPending={handleChangeStatus.isPending}
        isOutOfStock={isOutOfStock}
        onConfirm={() => handleStatusChange("CONFIRMED")}
        onShipping={() => handleStatusChange("SHIPPING")}
        onComplete={() => handleStatusChange("COMPLETED")}
        onOpenCancelDialog={() => setOpenCancelDialog(true)}
        onOpenApproveReturn={() => setOpenApproveReturn(true)}
        onOpenRejectReturn={() => setOpenRejectReturn(true)}
      />
    </>
  );
}
