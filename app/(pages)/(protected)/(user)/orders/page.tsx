"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import orderApi from "@/api/routes/orderApi";
import { Order } from "@/interfaces/order";
import OrderTabs from "@/components/orders/OrderTabs";
import OrderDetail from "@/components/orders/OrderDetail";
import CancelOrderDialog from "@/components/orders/CancelOrderDialog";
import ReturnOrderDialog from "@/components/orders/ReturnOrderDialog";

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openCancelled, setOpenCancelled] = useState(false);
  const [openReturned, setOpenReturned] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getMyOrders,
  });

  const handleUpdateOrder = useMutation({
    mutationFn: ({
      id,
      status,
      data,
    }: {
      id: number;
      status: Order["status"];
      data?: {
        cancelNote?: string;
        returnNote?: string;
        returnMethod?: "REFUND" | "EXCHANGE";
        returnRejectNote?: string;
      };
    }) => orderApi.updateOrderStatus(id, status, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      if (variables.status === "CANCELLED") {
        toast.success("Hủy đơn hàng thành công");
        setOpenCancelled(false);
      }

      if (variables.status === "RETURN_REQUESTED") {
        toast.success("Đã gửi yêu cầu hoàn hàng");
        setOpenReturned(false);
      }

      if (variables.status === "COMPLETED") {
        toast.success("Đã xác nhận nhận hàng");
      }

      setSelectedOrder(null);
    },

    onError: () => {
      toast.error("Cập nhật đơn hàng thất bại");
    },
  });

  const orders = data ?? [];

  return (
    <div>
      <OrderTabs orders={orders} onSelect={setSelectedOrder} />

      <OrderDetail
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancel={() => setOpenCancelled(true)}
        onReturn={() => setOpenReturned(true)}
        onCompleted={() => {
          if (!selectedOrder) return;

          handleUpdateOrder.mutate({
            id: selectedOrder.id,
            status: "COMPLETED",
          });
        }}
      />

      <CancelOrderDialog
        open={openCancelled}
        onOpenChange={setOpenCancelled}
        order={selectedOrder}
        onSubmit={(cancelNote) => {
          if (!selectedOrder) return;

          handleUpdateOrder.mutate({
            id: selectedOrder.id,
            status: "CANCELLED",
            data: {
              cancelNote,
            },
          });
        }}
      />

      <ReturnOrderDialog
        open={openReturned}
        onOpenChange={setOpenReturned}
        order={selectedOrder}
        onSubmit={(returnNote) => {
          if (!selectedOrder) return;

          handleUpdateOrder.mutate({
            id: selectedOrder.id,
            status: "RETURN_REQUESTED",
            data: {
              returnNote,
            },
          });
        }}
      />
    </div>
  );
}
