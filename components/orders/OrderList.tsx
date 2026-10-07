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
import Image from "next/image";

export default function OrderList({
  orders,
  onSelect,
  value,
}: {
  orders: Order[];
  onSelect: (order: Order) => void;
  value: string;
}) {
  const soLuongSanPham = orders.reduce((total, order) => {
    return (
      total +
      order.items.reduce((sum, item) => {
        return sum + item.quantity;
      }, 0)
    );
  }, 0);

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
          <h1 className="w-32">Mã đơn hàng</h1>
          <h1 className="flex-1">Sản phẩm</h1>
          <h1 className="w-36 text-center">Tổng số lượng</h1>
          <h1 className="w-36">Ngày đặt</h1>
          <h1 className="w-44">Tổng tiền</h1>
          {(value === "returned" || value === "shipping") && (
            <h1 className="w-32">Trạng thái</h1>
          )}
          {value === "cancelled" && <h1 className="w-28">Huy boi</h1>}
        </CardContent>
      </Card>

      {orders.map((order) => {
        const { items } = order;
        const { product } = items[0];

        return (
          <Card
            key={order.id}
            className="py-3 rounded-md hover:cursor-pointer"
            onClick={() => onSelect(order)}
          >
            <CardContent className="flex gap-4 text-base justify-center items-center">
              <h1 className="w-32">{order.orderCode}</h1>

              <div className="flex-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 pr-4">
                    <Image
                      src={item.product.images[0].imageUrl}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                    <h1 className="truncate text-xs">{item.product.name}</h1>
                    <span className="text-xs">x{item.quantity}</span>
                  </div>
                ))}

                
              </div>

              <span className="w-36 text-center">{soLuongSanPham}</span>

              <h1 className="w-36">{formatDate(order.createdAt)}</h1>

              <h1 className="w-44">{formatVND(order.total)}</h1>

              {(value === "returned" || value === "shipping") && (
                <h1 className="w-32">{order.status}</h1>
              )}

              {value === "cancelled" && <h1 className="w-28">{order.role}</h1>}
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
