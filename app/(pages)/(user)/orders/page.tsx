"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState } from "react";
import harp2 from "@/public/h1470.png";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import orderApi from "@/api/routes/orderApi";
import { formatDate, formatVND } from "@/lib/format";
import { FolderCode, List } from "lucide-react";
import { Order } from "@/interfaces/order";
import OrderList from "@/components/orders/OrderList";

const orderTabs: Record<string, Order["status"][]> = {
  pending: ["PENDING"],
  shipping: ["CONFIRMED", "SHIPPING"],
  completed: ["COMPLETED"],
  returned: ["RETURNED"],
  cancelled: ["CANCELLED"],
};
export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getMyOrders,
  });

  return (
    <div>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="shipping">Đang giao hàng</TabsTrigger>
          <TabsTrigger value="completed">Đã giao</TabsTrigger>
          <TabsTrigger value="returned">Trả hàng</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách</CardTitle>
              <CardDescription>Nhấn để xem chi tiết</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <OrderList
                orders={
                  data?.filter((order) => order.status === "PENDING") ?? []
                }
                onSelect={setSelectedOrder}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách</CardTitle>
              <CardDescription>Nhấn để xem chi tiết</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <OrderList
                orders={
                  data?.filter(
                    (order) =>
                      order.status === "CONFIRMED" ||
                      order.status === "SHIPPING",
                  ) ?? []
                }
                onSelect={setSelectedOrder}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách</CardTitle>
              <CardDescription>Nhấn để xem chi tiết</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <OrderList
                orders={
                  data?.filter((order) => order.status === "COMPLETED") ?? []
                }
                onSelect={setSelectedOrder}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cancelled">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách</CardTitle>
              <CardDescription>Nhấn để xem chi tiết</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <OrderList
                orders={
                  data?.filter((order) => order.status === "CANCELLED") ?? []
                }
                onSelect={setSelectedOrder}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="returned">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách</CardTitle>
              <CardDescription>Nhấn để xem chi tiết</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <OrderList
                orders={
                  data?.filter((order) => order.status === "RETURNED") ?? []
                }
                onSelect={setSelectedOrder}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog
        open={selectedOrder !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
          }
        }}
      >
        <DialogContent className="h-96 overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <>
              <div>
                <p>Mã đơn hàng: {selectedOrder.id}</p>

                <p>Trạng thái: {selectedOrder.status}</p>

                <p>Ngày đặt: {formatDate(selectedOrder.createdAt)}</p>
              </div>

              <div>
                {selectedOrder.items.map((item) => (
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

                <h1>Tổng tiền: {formatVND(selectedOrder.total)}</h1>
              </div>

              <Separator />

              <h2>Thông tin giao hàng</h2>

              <p>
                {selectedOrder.user?.fullname} - {selectedOrder.phone} -{" "}
                {selectedOrder.address}
              </p>

              <p>Thanh toán khi nhận hàng</p>

              <Separator />

              {selectedOrder.status === "PENDING" && (
                <Button>Hủy đơn hàng</Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
