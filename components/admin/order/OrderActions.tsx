import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import OrderDetail from "./OrderDetail";
import { Order } from "@/interfaces/order";
import useDeleteOrder from "@/hooks/orders/mutations/useDeleteOrder";

export default function OrderActions({ order }: { order: Order }) {
  const [openDetails, setOpenDetails] = useState(false);

  const deleteOrderMutation = useDeleteOrder();

  const onDeleteOrder = (id: number) => {
    deleteOrderMutation.mutate(id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="h-8 w-8 p-0" />}
        >
          <span className="sr-only">Open menu actions</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setOpenDetails(true);
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteOrder(order.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <OrderDetail
        data={order}
        open={openDetails}
        onOpenChange={setOpenDetails}
      />
    </>
  );
}
