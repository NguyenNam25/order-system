import orderApi from "@/api/routes/orderApi";
import { useQuery } from "@tanstack/react-query";

export default function useMyOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getMyOrders,
  });
}
