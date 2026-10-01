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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import orderApi from "@/api/routes/orderApi";
import { formatDate, formatVND } from "@/lib/format";
import { Order } from "@/interfaces/order";
import OrderList from "@/components/orders/OrderList";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const orderTabs: Record<string, Order["status"][]> = {
  pending: ["PENDING"],
  shipping: ["CONFIRMED", "SHIPPING"],
  completed: ["COMPLETED"],
  returned: ["RETURNED"],
  cancelled: ["CANCELLED"],
};

interface CheckoutForm {
  cancelNote: string;
}

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openCancelled, setOpenCancelled] = useState(false);
  const [openReturned, setOpenReturned] = useState(false);
  const { register, handleSubmit, reset } = useForm<CheckoutForm>();
  const [value, setValue] = useState("pending");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getMyOrders,
  });

  const queryClient = useQueryClient();

  const handleCancelled = useMutation({
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

      toast.success("Xác nhận đơn hàng thành công");
      setOpenCancelled(false);
      setSelectedOrder(null);
    },

    onError: () => {
      toast.error("Xác nhận đơn hàng thất bại");
    },
  });

  const handleReturned = useMutation({
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

      toast.success("Xác nhận đơn hàng thành công");
      setOpenReturned(false);
      setSelectedOrder(null);
    },

    onError: () => {
      toast.error("Xác nhận đơn hàng thất bại");
    },
  });

  const handleConfirmed = useMutation({
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

      toast.success("Xác nhận đơn hàng thành công");
      setSelectedOrder(null);
    },

    onError: () => {
      toast.error("Xác nhận đơn hàng thất bại");
    },
  });

  return (
    <div>
      <Tabs value={value} onValueChange={setValue}>
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
                value={value}
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
                value={value}
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
                value={value}
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
                value={value}
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
                  data?.filter(
                    (order) =>
                      order.status === "RETURNED" ||
                      order.status === "RETURN_REQUESTED",
                  ) ?? []
                }
                onSelect={setSelectedOrder}
                value={value}
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
        <DialogContent className="h-xl overflow-y-auto gap-4">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <p>Mã đơn hàng: {selectedOrder.id}</p>
                  <p>Trạng thái: {selectedOrder.status}</p>
                </div>

                <p>Ngày đặt: {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div className="flex flex-col gap-2 ">
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

              {selectedOrder.status === "COMPLETED" ? (
                <p>Đã thanh toán</p>
              ) : (
                <p>Thanh toán khi nhận hàng</p>
              )}

              {selectedOrder.cancelNote && (
                <>
                  <Separator />
                  <div className="flex gap-2">
                    <h1>Lí do: </h1>
                    <p>{selectedOrder.cancelNote}</p>
                  </div>
                </>
              )}

              {selectedOrder.status === "PENDING" && (
                <>
                  <Separator />
                  <Button onClick={() => setOpenCancelled(true)}>
                    Hủy đơn hàng
                  </Button>
                </>
              )}

              {selectedOrder.status === "SHIPPING" && (
                <>
                  <Separator />
                  <Button
                    onClick={() => {
                      handleReturned.mutate({
                        id: selectedOrder.id,
                        status: "COMPLETED",
                        cancelNote: "",
                        role: "USER",
                      });
                    }}
                  >
                    Da nhan hang
                  </Button>
                </>
              )}

              {selectedOrder.status === "COMPLETED" && (
                <>
                  <Separator />
                  <Button onClick={() => setOpenReturned(true)}>
                    Hoàn đơn hàng
                  </Button>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openCancelled} onOpenChange={setOpenCancelled}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đơn hàng?</DialogTitle>
            {selectedOrder && (
              <form
                onSubmit={handleSubmit((values) => {
                  handleCancelled.mutate({
                    id: selectedOrder.id,
                    status: "CANCELLED",
                    cancelNote: values.cancelNote,
                    role: "USER",
                  });
                })}
              >
                <Field>
                  <FieldLabel htmlFor="note">Lí do</FieldLabel>
                  <Input
                    {...register("cancelNote")}
                    id="note"
                    type="text"
                    className="h-12 rounded-lg bg-white border-gray-300"
                  />
                </Field>
                <Button type="submit" className={"rounded-lg mt-4"}>
                  Hủy đơn hàng
                </Button>
              </form>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openReturned} onOpenChange={setOpenReturned}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đơn hàng?</DialogTitle>
            {selectedOrder && (
              <form
                onSubmit={handleSubmit((values) => {
                  handleReturned.mutate({
                    id: selectedOrder.id,
                    status: "RETURN_REQUESTED",
                    cancelNote: values.cancelNote,
                    role: "USER",
                  });
                })}
              >
                <Field>
                  <FieldLabel htmlFor="note">Lí do</FieldLabel>
                  <Input
                    {...register("cancelNote")}
                    id="note"
                    type="text"
                    className="h-12 rounded-lg bg-white border-gray-300"
                  />
                </Field>
                <Button type="submit">Hoàn đơn hàng</Button>
              </form>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
