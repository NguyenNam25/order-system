import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OrderDetail from "./OrderDetail";
import { Order } from "@/interfaces/order";
import orderApi from "@/api/routes/orderApi";

export default function OrderActions({ order }: { order: Order }) {
  const [openDetails, setOpenDetails] = useState(false);

  const queryClient = useQueryClient();

  const deleteOrderMutation = useMutation({
    mutationFn: orderApi.deleteOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

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
