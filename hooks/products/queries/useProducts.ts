import productApi from "@/api/routes/productApi";
import { useQuery } from "@tanstack/react-query";

export default function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAllProducts,
  });
}
