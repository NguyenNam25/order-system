"use client";

import { useState } from "react";
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
import { Clock3, Truck, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

const menuTabsTrigger = [
  {
    value: "pending",
    title: "Chờ xác nhận",
    icon: Clock3,
  },
  {
    value: "shipping",
    title: "Đang giao",
    icon: Truck,
  },
  {
    value: "completed",
    title: "Đã giao",
    icon: CheckCircle2,
  },
  {
    value: "returned",
    title: "Trả hàng",
    icon: RotateCcw,
  },
  {
    value: "cancelled",
    title: "Đã hủy",
    icon: XCircle,
  },
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
      order.status === "RETURN_APPROVED" ||
      order.status === "RETURN_REQUESTED" ||
      order.status === "RETURN_REJECTED",
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

  const filteredOrders = {
    pending: orders.filter((order) => order.status === "PENDING"),

    shipping: orders.filter(
      (order) => order.status === "CONFIRMED" || order.status === "SHIPPING",
    ),

    completed: orders.filter((order) => order.status === "COMPLETED"),

    returned: orders.filter(
      (order) =>
        order.status === "RETURN_APPROVED" ||
        order.status === "RETURN_REQUESTED" ||
        order.status === "RETURN_REJECTED",
    ),

    cancelled: orders.filter((order) => order.status === "CANCELLED"),
  };

  return (
    <Tabs value={value} onValueChange={setValue} className="w-full">
      <TabsList className="flex h-auto w-full justify-start gap-1 rounded-xl border border-white/[0.07] bg-[#111114] p-1.5">
        {menuTabsTrigger.map((triggerItem) => {
          const Icon = triggerItem.icon;

          return (
            <TabsTrigger
              key={triggerItem.value}
              value={triggerItem.value}
              className="
          min-w-fit gap-2 rounded-lg border border-transparent
          px-3 py-2.5 text-xs font-medium text-zinc-400
          transition-colors duration-200
          hover:bg-white/6 hover:text-white
          data-[state=active]:border-[#FF0033]/30
          data-[state=active]:bg-[#FF0033]/15
          data-[state=active]:font-semibold
          data-[state=active]:text-[#FF4D6D]
          data-[state=active]:shadow-none
          focus-visible:ring-2 focus-visible:ring-[#FF0033]/50
          sm:px-4 sm:text-sm
        "
            >
              <Icon className="size-4 shrink-0" />
              <span>{triggerItem.title}</span>

              <TabsBadge>
                {
                  orderQuantities[
                    triggerItem.value as keyof typeof orderQuantities
                  ]
                }
              </TabsBadge>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {menuTabsTrigger.map((triggerItem) => (
        <TabsContent
          key={triggerItem.value}
          value={triggerItem.value}
          className="mt-5"
        >
          <OrderSection
            title={triggerItem.title}
            orders={
              filteredOrders[triggerItem.value as keyof typeof filteredOrders]
            }
            onSelect={onSelect}
            value={triggerItem.value}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function OrderSection({
  title,
  orders,
  onSelect,
  value,
}: {
  title: string;
  orders: Order[];
  onSelect: (order: Order) => void;
  value: string;
}) {
  return (
    <Card className="gap-0 overflow-hidden rounded-xl border-white/[0.07] bg-[#18181B] py-0 text-zinc-100">
      <CardHeader className="border-b border-white/6 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>

            <CardDescription className="mt-1 text-xs text-zinc-500">
              Chọn một đơn hàng để xem chi tiết và thực hiện thao tác.
            </CardDescription>
          </div>

          <span className="rounded-full border border-white/8 bg-[#242429] px-3 py-1 text-xs text-zinc-300">
            {orders.length} đơn hàng
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-5">
        <OrderList orders={orders} onSelect={onSelect} value={value} />
      </CardContent>
    </Card>
  );
}
