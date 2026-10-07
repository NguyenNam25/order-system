import categoryApi from "@/api/routes/categoryApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Order } from "@/interfaces/order";
import { formatDate, formatVND } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import orderApi from "@/api/routes/orderApi";
import { toast } from "sonner";

export default function OrderDetail({
  data,
  open,
  onOpenChange,
}: {
  data: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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

      toast.success("Xác nhận đơn hàng thành công");
      onOpenChange(false);
    },

    onError: () => {
      toast.error("Xác nhận đơn hàng thất bại");
    },
  });

  const onConfirm = () => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "CONFIRMED",
      note: data.note ?? "",
      role: "ADMIN",
    });
  };

  const onShipping = () => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "SHIPPING",
      note: data.note ?? "",
      role: "ADMIN",
    });
  };

  const onComplete = () => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "COMPLETED",
      note: data.note ?? "",
      role: "ADMIN",
    });
  };

  const onCancel = () => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "CANCELLED",
      note: data.note ?? "",
      role: "ADMIN",
    });
  };

  const onReturn = () => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "RETURNED",
      note: data.cancelNote ?? "",
      role: "ADMIN",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-xl overflow-y-auto gap-4">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p>Mã đơn hàng: {data.id}</p>
            <p>Trạng thái: {data.status}</p>
          </div>

          <p>Ngày đặt: {formatDate(data.createdAt)}</p>
        </div>
        <div className="flex flex-col gap-2 ">
          {data.items.map((item) => (
            <Card key={item.id} className="rounded-xl py-3">
              <CardContent className="flex items-center justify-between px-3">
                <div className="flex items-center gap-4 w-full">
                  <Image
                    src={item.product.images[0].imageUrl}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />

                  <h1 className="flex-1">{item.product.name}</h1>

                  <h2>x{item.quantity}</h2>

                  <h2 className="text-red-600">
                    {formatVND(item.priceAtPurchase)}
                  </h2>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <h1>Tổng tiền: {formatVND(data.total)}</h1>
        <Separator />

        <h2>Thông tin giao hàng</h2>

        <p>
          {data.receiverName} - {data.phone} - {data.address}
        </p>

        <p>Thanh toán khi nhận hàng</p>

        {data.cancelNote && (
          <>
            <Separator />
            <div className="flex gap-2">
              <h1>Lí do: </h1>
              <p>{data.cancelNote}</p>
            </div>
          </>
        )}

        {data.status === "PENDING" && (
          <div>
            <Separator />
            <div className="flex flex-col gap-2 mt-2">
              <Button
                variant="destructive"
                onClick={onCancel}
                disabled={handleChangeStatus.isPending}
              >
                {handleChangeStatus.isPending
                  ? "Đang hủy..."
                  : "Xác nhận hủy đơn hàng"}
              </Button>
              <Button onClick={onConfirm} disabled={handleChangeStatus.isPending}>
                {handleChangeStatus.isPending
                  ? "Đang xác nhận..."
                  : "Xác nhận đơn hàng"}
              </Button>
            </div>
          </div>
        )}

        {data.status === "CONFIRMED" && (
          <>
            <Separator />
            <Button
              onClick={onShipping}
              disabled={handleChangeStatus.isPending}
            >
              {handleChangeStatus.isPending
                ? "Đang xác nhận..."
                : "Xác nhận dang giao hàng"}
            </Button>
          </>
        )}

        {data.status === "SHIPPING" && (
          <>
            <Separator />
            <Button
              onClick={onComplete}
              disabled={handleChangeStatus.isPending}
            >
              {handleChangeStatus.isPending
                ? "Đang xác nhận..."
                : "Đã giao hàng"}
            </Button>
          </>
        )}

        {data.status === "RETURN_REQUESTED" && (
          <>
            <Separator />
            <Button onClick={onReturn} disabled={handleChangeStatus.isPending}>
              {handleChangeStatus.isPending
                ? "Đang xác nhận..."
                : "Xác nhận hoàn hàng"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
