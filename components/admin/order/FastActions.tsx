"use client";

import { useState } from "react";
import type { Order } from "@/interfaces/order";
import CancelOrderDialog from "@/components/orders/CancelOrderDialog";
import ReturnApproveDialog from "@/components/orders/ReturnApproved";
import ReturnRejectDialog from "@/components/orders/ReturnRejected";
import OrderStatusActions from "./detail/OrderStatusActions";
import useUpdateOrderStatus, { UpdateOrderStatusPayload } from "@/hooks/orders/mutations/useUpdateOrderStatus";
import { toast } from "sonner";

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
    handleChangeStatus.mutate(
      {
        id: order.id,
        status,
        data,
      },
      {
        onSuccess: () => {
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
              break;

            case "COMPLETED":
              toast.success("Xác nhận giao hàng thành công");
              break;

            case "RETURN_APPROVED":
              if (data?.returnMethod === "REFUND") {
                toast.success("Đã duyệt yêu cầu hoàn tiền");
              } else if (data?.returnMethod === "EXCHANGE") {
                toast.success("Đã duyệt yêu cầu đổi hàng");
              } else {
                toast.success("Đã duyệt yêu cầu hoàn hàng");
              }

              setOpenApproveReturn(false);
              break;

            case "RETURN_REJECTED":
              toast.success("Đã từ chối yêu cầu hoàn hàng");
              setOpenRejectReturn(false);
              break;

            default:
              toast.success("Cập nhật đơn hàng thành công");
              break;
          }
        },
      },
    );
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
