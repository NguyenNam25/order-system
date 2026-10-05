"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Order } from "@/interfaces/order";
import { formatDate, formatVND } from "@/lib/format";

interface OrderDetailDialogProps {
  order: Order | null;
  onClose: () => void;
  onCancel: () => void;
  onReturn: () => void;
  onCompleted: () => void;
}

export default function OrderDetail({
  order,
  onClose,
  onCancel,
  onReturn,
  onCompleted,
}: OrderDetailDialogProps) {
  return (
    <Dialog
      open={order !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="h-xl overflow-y-auto gap-4">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        </DialogHeader>

        {order && (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <p>Mã đơn hàng: {order.id}</p>
                <p>Trạng thái: {order.status}</p>
              </div>

              <p>Ngày đặt: {formatDate(order.createdAt)}</p>
            </div>

            <div className="flex flex-col gap-2">
              {order.items.map((item) => (
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

              <h1>Tổng tiền: {formatVND(order.total)}</h1>
            </div>

            <Separator />

            <h2>Thông tin giao hàng</h2>

            <p>
              {order.user?.fullname} - {order.phone} - {order.address}
            </p>

            {order.status === "COMPLETED" ? (
              <p>Đã thanh toán</p>
            ) : (
              <p>Thanh toán khi nhận hàng</p>
            )}

            {order.cancelNote && (
              <>
                <Separator />
                <div className="flex gap-2">
                  <h1>Lí do:</h1>
                  <p>{order.cancelNote}</p>
                </div>
              </>
            )}

            {order.status === "PENDING" && (
              <>
                <Separator />
                <Button onClick={onCancel}>Hủy đơn hàng</Button>
              </>
            )}

            {order.status === "SHIPPING" && (
              <>
                <Separator />
                <Button onClick={onCompleted}>Đã nhận hàng</Button>
              </>
            )}

            {order.status === "COMPLETED" && (
              <>
                <Separator />
                <Button onClick={onReturn}>Hoàn đơn hàng</Button>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
