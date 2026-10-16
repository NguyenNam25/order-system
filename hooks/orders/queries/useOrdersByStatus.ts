import orderApi from "@/api/routes/orderApi";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/interfaces/order";

export default function useOrdersByStatus(
  status: Order["status"][],
) {
  const normalizedStatus = [...status].sort();

  return useQuery({
    queryKey: ["orders", normalizedStatus],
    queryFn: () => orderApi.getOrdersByStatus(normalizedStatus),
  });
}