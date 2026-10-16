import categoryApi from "@/api/routes/categoryApi";
import { useQuery } from "@tanstack/react-query";

export default function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAllCategories,
  });
}
