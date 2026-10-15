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
import { useState } from "react";
import CancelOrderDialog from "@/components/orders/CancelOrderDialog";
import ReturnApproveDialog from "@/components/orders/ReturnApproved";
import ReturnRejectDialog from "@/components/orders/ReturnRejected";

export default function OrderDetail({
  data,
  open,
  onOpenChange,
}: {
  data: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
      onOpenChange(false);
    },

    onError: () => {
      toast.error("Cập nhật đơn hàng thất bại");
    },
  });

  const onConfirm = () => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "CONFIRMED",
    });
  };

  const onShipping = () => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "SHIPPING",
    });
  };

  const onComplete = () => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "COMPLETED",
    });
  };

  const onCancel = (cancelNote: string) => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "CANCELLED",
      data: {
        cancelNote,
      },
    });
  };

  const onApproveReturn = (returnMethod: "REFUND" | "EXCHANGE") => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "RETURN_APPROVED",
      data: {
        returnMethod,
      },
    });
  };

  const onRejectReturn = (returnRejectNote: string) => {
    handleChangeStatus.mutate({
      id: data.id,
      status: "RETURN_REJECTED",
      data: {
        returnRejectNote,
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-2xl! gap-6 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-xl">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Chi tiết đơn hàng
            </DialogTitle>
            <DialogDescription className="text-sm leading-5 text-muted-foreground">
              Xem thông tin sản phẩm, giao hàng và cập nhật trạng thái đơn hàng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Mã đơn hàng
                  </p>
                  <p className="text-base font-semibold">#{data.id}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Trạng thái
                  </p>
                  <span className="inline-flex rounded-md border border-border bg-background px-2.5 py-1 text-sm font-medium">
                    {data.status}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Ngày đặt hàng
                </p>
                <p className="text-sm font-medium">
                  {formatDate(data.createdAt)}
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Sản phẩm đã đặt</h3>
                <span className="text-xs text-muted-foreground">
                  {data.items.length} sản phẩm
                </span>
              </div>

              <div className="space-y-3">
                {data.items.map((item) => (
                  <Card
                    key={item.id}
                    className="rounded-xl border-border py-3 shadow-none"
                  >
                    <CardContent className="flex items-center gap-3 px-3 sm:gap-4 sm:px-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30">
                        <Image
                          src={item.product.images[0].imageUrl}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="line-clamp-2 text-sm font-medium leading-5">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Số lượng: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-right text-sm font-semibold tabular-nums text-primary">
                        {formatVND(item.priceAtPurchase)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Tổng thanh toán
                </span>
                <span className="text-lg font-semibold tabular-nums text-primary">
                  {formatVND(data.total)}
                </span>
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <h3 className="text-sm font-semibold">Thông tin giao hàng</h3>

              <div className="space-y-3 rounded-xl border border-border p-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Người nhận
                  </p>
                  <p className="text-sm font-medium">{data.receiverName}</p>
                </div>

                <Separator />

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Số điện thoại
                  </p>
                  <p className="text-sm">{data.phone}</p>
                </div>

                <Separator />

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Địa chỉ
                  </p>
                  <p className="break-words text-sm leading-6">
                    {data.address}
                  </p>
                </div>

                <Separator />

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Phương thức thanh toán
                  </p>
                  <p className="text-sm font-medium">Thanh toán khi nhận hàng</p>
                </div>
              </div>
            </section>

            {data.cancelNote && (
              <>
                <Separator />
                <section className="space-y-2 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <h3 className="text-sm font-semibold text-destructive">
                    Lý do hủy đơn hàng
                  </h3>
                  <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {data.cancelNote}
                  </p>
                </section>
              </>
            )}

            {data.returnNote && (
              <>
                <Separator />
                <section className="space-y-2 rounded-xl border border-border bg-muted/20 p-4">
                  <h3 className="text-sm font-semibold">Lý do yêu cầu hoàn hàng</h3>
                  <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {data.returnNote}
                  </p>
                </section>
              </>
            )}

            {data.returnRejectNote && (
              <>
                <Separator />
                <section className="space-y-2 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <h3 className="text-sm font-semibold text-destructive">
                    Lý do từ chối hoàn hàng
                  </h3>
                  <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {data.returnRejectNote}
                  </p>
                </section>
              </>
            )}

            {data.status === "PENDING" && (
              <>
                <Separator />
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setOpenCancelDialog(true)}
                    disabled={handleChangeStatus.isPending}
                    className="h-10 rounded-lg border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    {handleChangeStatus.isPending
                      ? "Đang hủy..."
                      : "Hủy đơn hàng"}
                  </Button>

                  <Button
                    onClick={onConfirm}
                    disabled={handleChangeStatus.isPending}
                    className="h-10 rounded-lg"
                  >
                    {handleChangeStatus.isPending
                      ? "Đang xác nhận..."
                      : "Xác nhận đơn hàng"}
                  </Button>
                </div>
              </>
            )}

            {data.status === "CONFIRMED" && (
              <>
                <Separator />
                <Button
                  onClick={onShipping}
                  disabled={handleChangeStatus.isPending}
                  className="h-10 w-full rounded-lg"
                >
                  {handleChangeStatus.isPending
                    ? "Đang cập nhật..."
                    : "Xác nhận đang giao hàng"}
                </Button>
              </>
            )}

            {data.status === "SHIPPING" && (
              <>
                <Separator />
                <Button
                  onClick={onComplete}
                  disabled={handleChangeStatus.isPending}
                  className="h-10 w-full rounded-lg"
                >
                  {handleChangeStatus.isPending
                    ? "Đang cập nhật..."
                    : "Xác nhận đã giao hàng"}
                </Button>
              </>
            )}

            {data.status === "RETURN_REQUESTED" && (
              <>
                <Separator />
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    onClick={() => setOpenApproveReturn(true)}
                    disabled={handleChangeStatus.isPending}
                    className="h-10 rounded-lg"
                  >
                    Duyệt hoàn hàng
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => setOpenRejectReturn(true)}
                    disabled={handleChangeStatus.isPending}
                    className="h-10 rounded-lg"
                  >
                    Từ chối hoàn hàng
                  </Button>
                </div>
              </>
            )}
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
