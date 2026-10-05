"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@/interfaces/order";
import orderApi from "@/api/routes/orderApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface FastActionsProps {
  order: Order;
}

export default function FastActions({ order }: FastActionsProps) {
  const queryClient = useQueryClient();

  const handleChangeStatus = useMutation({
    mutationFn: ({
      id,
      status,
      note,
      role,
    }: {
      id: number;
      status: Order["status"];
      note: string;
      role: Order["role"];
    }) => orderApi.updateOrderStatus(id, status, note, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success("Cập nhật trạng thái đơn hàng thành công");
    },

    onError: () => {
      toast.error("Cập nhật trạng thái đơn hàng thất bại");
    },
  });

  const handleStatusChange = (status: Order["status"]) => {
    handleChangeStatus.mutate({
      id: order.id,
      status,
      note: order.note ?? "",
      role: "ADMIN",
    });
  };

  switch (order.status) {
    case "PENDING":
      return (
        <div className="flex flex-col gap-2">
          <Button
            variant="destructive"
            onClick={() => handleStatusChange("CANCELLED")}
            disabled={handleChangeStatus.isPending}
          >
            {handleChangeStatus.isPending
              ? "Đang xử lý..."
              : "Xác nhận hủy đơn hàng"}
          </Button>

          <Button
            onClick={() => handleStatusChange("CONFIRMED")}
            disabled={handleChangeStatus.isPending}
          >
            {handleChangeStatus.isPending
              ? "Đang xử lý..."
              : "Xác nhận đơn hàng"}
          </Button>
        </div>
      );

    case "CONFIRMED":
      return (
        <Button
          onClick={() => handleStatusChange("SHIPPING")}
          disabled={handleChangeStatus.isPending}
        >
          {handleChangeStatus.isPending
            ? "Đang xử lý..."
            : "Xác nhận đang giao hàng"}
        </Button>
      );

    case "SHIPPING":
      return (
        <Button
          onClick={() => handleStatusChange("COMPLETED")}
          disabled={handleChangeStatus.isPending}
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
        >
          {handleChangeStatus.isPending
            ? "Đang xử lý..."
            : "Xác nhận hoàn hàng"}
        </Button>
      );

    default:
      return null;
  }
}