import { Order } from "@/interfaces/order";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { List } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { formatDate, formatVND } from "@/lib/format";

export default function OrderList({
  orders,
  onSelect,
}: {
  orders: Order[];
  onSelect: (order: Order) => void;
}) {
  if (orders.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <List />
          </EmptyMedia>

          <EmptyTitle>Chưa có đơn hàng</EmptyTitle>

          <EmptyDescription>
            Bạn chưa có đơn hàng nào trong mục này.
          </EmptyDescription>

          <EmptyContent />
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <Card className="py-3 rounded-md">
        <CardContent className="flex gap-4 font-bold text-base">
          <h1 className="flex-2">Mã đơn hàng</h1>
          <h1 className="w-48">Ngày đặt</h1>
          <h1 className="flex-1">Tổng tiền</h1>
          <h1 className="w-28">Trạng thái</h1>
        </CardContent>
      </Card>

      {orders.map((order) => (
        <Card
          key={order.id}
          className="py-3 rounded-md hover:cursor-pointer"
          onClick={() => onSelect(order)}
        >
          <CardContent className="flex gap-4 text-base">
            <h1 className="flex-2">#{order.id}</h1>

            <h1 className="w-48">{formatDate(order.createdAt)}</h1>

            <h1 className="flex-1">{formatVND(order.total)}</h1>

            <h1 className="w-28">{order.status}</h1>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
