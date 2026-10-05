"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/interfaces/order";
import OrderList from "@/components/orders/OrderList";
import TabsBadge from "@/components/layout-components/TabsBadge";
import { useState } from "react";

const menuTabsTrigger = [
  { value: "pending", title: "Chờ xác nhận" },
  { value: "shipping", title: "Đang giao hàng" },
  { value: "completed", title: "Đã giao" },
  { value: "returned", title: "Trả hàng" },
  { value: "cancelled", title: "Đã hủy" },
];

interface OrderTabsProps {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export default function OrderTabs({ orders, onSelect }: OrderTabsProps) {
  const [value, setValue] = useState("pending");

  const pendingOrderQuantity = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const shippingOrderQuantity = orders.filter(
    (order) => order.status === "CONFIRMED" || order.status === "SHIPPING",
  ).length;

  const completedOrderQuantity = orders.filter(
    (order) => order.status === "COMPLETED",
  ).length;

  const returnedOrderQuantity = orders.filter(
    (order) =>
      order.status === "RETURNED" || order.status === "RETURN_REQUESTED",
  ).length;

  const cancelledOrderQuantity = orders.filter(
    (order) => order.status === "CANCELLED",
  ).length;

  const orderQuantities = {
    pending: pendingOrderQuantity,
    shipping: shippingOrderQuantity,
    completed: completedOrderQuantity,
    returned: returnedOrderQuantity,
    cancelled: cancelledOrderQuantity,
  };

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList>
        {menuTabsTrigger.map((triggerItem) => (
          <TabsTrigger
            key={triggerItem.value}
            value={triggerItem.value}
            className="flex items-center justify-center gap-1"
          >
            <span>{triggerItem.title}</span>

            <TabsBadge>
              {
                orderQuantities[
                  triggerItem.value as keyof typeof orderQuantities
                ]
              }
            </TabsBadge>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="pending">
        <OrderSection
          orders={orders.filter((order) => order.status === "PENDING")}
          onSelect={onSelect}
          value={value}
        />
      </TabsContent>

      <TabsContent value="shipping">
        <OrderSection
          orders={orders.filter(
            (order) =>
              order.status === "CONFIRMED" || order.status === "SHIPPING",
          )}
          onSelect={onSelect}
          value={value}
        />
      </TabsContent>

      <TabsContent value="completed">
        <OrderSection
          orders={orders.filter((order) => order.status === "COMPLETED")}
          onSelect={onSelect}
          value={value}
        />
      </TabsContent>

      <TabsContent value="returned">
        <OrderSection
          orders={orders.filter(
            (order) =>
              order.status === "RETURNED" ||
              order.status === "RETURN_REQUESTED",
          )}
          onSelect={onSelect}
          value={value}
        />
      </TabsContent>

      <TabsContent value="cancelled">
        <OrderSection
          orders={orders.filter((order) => order.status === "CANCELLED")}
          onSelect={onSelect}
          value={value}
        />
      </TabsContent>
    </Tabs>
  );
}

function OrderSection({
  orders,
  onSelect,
  value,
}: {
  orders: Order[];
  onSelect: (order: Order) => void;
  value: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách</CardTitle>
        <CardDescription>Nhấn để xem chi tiết</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <OrderList orders={orders} onSelect={onSelect} value={value} />
      </CardContent>
    </Card>
  );
}
