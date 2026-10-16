import orderApi from "@/api/routes/orderApi";
import { useQuery } from "@tanstack/react-query";

export default function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAllOrders,
  });
}
