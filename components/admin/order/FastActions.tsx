"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@/interfaces/order";
import orderApi from "@/api/routes/orderApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CancelOrderDialog from "@/components/orders/CancelOrderDialog";
import { useState } from "react";

interface FastActionsProps {
  order: Order;
}

export default function FastActions({ order }: FastActionsProps) {
  const [openCancelled, setOpenCancelled] = useState(false);
  const queryClient = useQueryClient();

  const handleChangeStatus = useMutation({
    mutationFn: ({
      id,
      status,
      cancelNote,
      role,
    }: {
      id: number;
      status: Order["status"];
      cancelNote: string;
      role: Order["role"];
    }) => orderApi.updateOrderStatus(id, status, cancelNote, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success("Cập nhật trạng thái đơn hàng thành công");
      setOpenCancelled(false);
    },

    onError: () => {
      toast.error("Cập nhật trạng thái đơn hàng thất bại");
    },
  });

  const handleStatusChange = (
    status: Order["status"],
    cancelNote: string = "",
  ) => {
    handleChangeStatus.mutate({
      id: order.id,
      status,
      cancelNote,
      role: "ADMIN",
    });
  };

  const isOutOfStock = order.items.some(
    (item) => item.quantity > item.product.quantity,
  );

  return (
    <>
      <CancelOrderDialog
        open={openCancelled}
        onOpenChange={setOpenCancelled}
        order={order}
        onSubmit={(cancelNote) => handleStatusChange("CANCELLED", cancelNote)}
      />

      {(() => {
        switch (order.status) {
          case "PENDING":
            return (
              <div className="flex flex-col gap-2">
                <Button
                  variant="destructive"
                  onClick={() => setOpenCancelled(true)}
                  disabled={handleChangeStatus.isPending}
                  className="w-28 rounded-lg"
                >
                  {handleChangeStatus.isPending
                    ? "Đang xử lý..."
                    : "Hủy đơn hàng"}
                </Button>

                <Button
                  onClick={() => handleStatusChange("CONFIRMED")}
                  disabled={handleChangeStatus.isPending || isOutOfStock}
                  className="w-28 rounded-lg"
                >
                  {handleChangeStatus.isPending ? "Đang xử lý..." : "Xác nhận"}
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
              <Button
                onClick={() => handleStatusChange("RETURNED")}
                disabled={handleChangeStatus.isPending}
                className="w-28 rounded-lg"
              >
                {handleChangeStatus.isPending ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            );

          default:
            return null;
        }
      })()}
    </>
  );
}
