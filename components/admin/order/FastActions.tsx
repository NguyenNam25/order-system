"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Order } from "@/interfaces/order";
import orderApi from "@/api/routes/orderApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CancelOrderDialog from "@/components/orders/CancelOrderDialog";
import ReturnApproveDialog from "@/components/orders/ReturnApproved";
import ReturnRejectDialog from "@/components/orders/ReturnRejected";

interface FastActionsProps {
  order: Order;
}

export default function FastActions({ order }: FastActionsProps) {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openApproveReturn, setOpenApproveReturn] = useState(false);
  const [openRejectReturn, setOpenRejectReturn] = useState(false);

  const queryClient = useQueryClient();

  const handleChangeStatus = useMutation({
    mutationFn: ({
      id,
      status,
      data,
    }: {
      id: number;
      status: Order["status"];
      data?: {
        cancelNote?: string;
        returnMethod?: "REFUND" | "EXCHANGE";
        returnRejectNote?: string;
      };
    }) => orderApi.updateOrderStatus(id, status, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success("Cập nhật đơn hàng thành công");

      setOpenCancelDialog(false);
      setOpenApproveReturn(false);
      setOpenRejectReturn(false);
    },

    onError: () => {
      toast.error("Cập nhật đơn hàng thất bại");
    },
  });

  const isOutOfStock = order.items.some(
    (item) => item.quantity > item.product.quantity,
  );

  const handleStatusChange = (
    status: Order["status"],
    data?: {
      cancelNote?: string;
      returnMethod?: "REFUND" | "EXCHANGE";
      returnRejectNote?: string;
    },
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
          handleStatusChange("CANCELLED", {
            cancelNote,
          })
        }
      />

      <ReturnApproveDialog
        open={openApproveReturn}
        onOpenChange={setOpenApproveReturn}
        order={order}
        onSubmit={(returnMethod) =>
          handleStatusChange("RETURN_APPROVED", {
            returnMethod,
          })
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

      {(() => {
        switch (order.status) {
          case "PENDING":
            return (
              <div className="flex flex-col gap-2">
                <Button
                  variant="destructive"
                  onClick={() => setOpenCancelDialog(true)}
                  disabled={handleChangeStatus.isPending}
                  className="w-28 rounded-lg"
                >
                  {handleChangeStatus.isPending
                    ? "Đang xử lý..."
                    : "Hủy đơn hàng"}
                </Button>

                <Button
                  onClick={() => handleStatusChange("CONFIRMED")}
                  disabled={
                    handleChangeStatus.isPending || isOutOfStock
                  }
                  className="w-28 rounded-lg"
                >
                  {handleChangeStatus.isPending
                    ? "Đang xử lý..."
                    : "Xác nhận"}
                </Button>
              </div>
            );

          case "CONFIRMED":
            return (
              <Button
                onClick={() => handleStatusChange("SHIPPING")}
                disabled={handleChangeStatus.isPending}
                className="w-28 rounded-lg"
              >
                {handleChangeStatus.isPending
                  ? "Đang xử lý..."
                  : "Đang giao hàng"}
              </Button>
            );

          case "SHIPPING":
            return (
              <Button
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={handleChangeStatus.isPending}
                className="w-28 rounded-lg"
              >
                {handleChangeStatus.isPending
                  ? "Đang xử lý..."
                  : "Đã giao hàng"}
              </Button>
            );

          case "RETURN_REQUESTED":
            return (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setOpenApproveReturn(true)}
                  disabled={handleChangeStatus.isPending}
                  className="w-28 rounded-lg"
                >
                  Duyệt hoàn hàng
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setOpenRejectReturn(true)}
                  disabled={handleChangeStatus.isPending}
                  className="w-28 rounded-lg"
                >
                  Từ chối
                </Button>
              </div>
            );

          default:
            return null;
        }
      })()}
    </>
  );
}