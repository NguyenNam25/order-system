
"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardList, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
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
      queryClient.invalidateQueries({ queryKey: ["orders"] });

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
    <main className="min-h-screen bg-[#09090B] px-4 py-6 text-zinc-100 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Tiêu đề */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[#FF334F]">
              <ClipboardList className="size-4" />
              <span className="font-medium">SHOPZONE</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Đơn hàng của tôi
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Theo dõi trạng thái và quản lý các đơn hàng của bạn.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="w-fit border-white/10 bg-[#18181B] text-zinc-200 hover:bg-white/[0.06] hover:text-white"
          >
            <RefreshCw
              className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>

        {isLoading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-white/[0.07] bg-[#18181B]">
            <LoaderCircle className="size-8 animate-spin text-[#FF334F]" />
            <p className="text-sm text-zinc-400">
              Đang tải danh sách đơn hàng...
            </p>
          </div>
        ) : isError ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-white/[0.07] bg-[#18181B] px-5 text-center">
            <ClipboardList className="mb-3 size-10 text-zinc-600" />
            <h2 className="font-semibold">Không thể tải đơn hàng</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại.
            </p>
            <Button
              type="button"
              onClick={() => refetch()}
              className="mt-5 bg-[#FF0033] text-white hover:bg-[#D9002B]"
            >
              Thử lại
            </Button>
          </div>
        ) : (
          <OrderTabs orders={orders} onSelect={setSelectedOrder} />
        )}

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
              data: { cancelNote },
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
              data: { returnNote },
            });
          }}
        />
      </div>
    </main>
  );
}
