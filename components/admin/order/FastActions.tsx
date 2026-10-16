"use client";

import { useState } from "react";
import type { Order } from "@/interfaces/order";
import CancelOrderDialog from "@/components/orders/CancelOrderDialog";
import ReturnApproveDialog from "@/components/orders/ReturnApproved";
import ReturnRejectDialog from "@/components/orders/ReturnRejected";
import OrderStatusActions from "./detail/OrderStatusActions";
import useUpdateOrderStatus from "@/hooks/orders/mutations/useUpdateOrderStatus";

interface FastActionsProps {
  order: Order;
}

interface UpdateOrderStatusPayload {
  id: number;
  status: Order["status"];
  data?: {
    cancelNote?: string;
    returnMethod?: "REFUND" | "EXCHANGE";
    returnRejectNote?: string;
  };
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
    handleChangeStatus.mutate({
      id: order.id,
      status,
      data,
    });
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
