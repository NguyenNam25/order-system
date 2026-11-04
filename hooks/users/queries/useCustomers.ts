import userApi from "@/api/routes/userApi";
import { useQuery } from "@tanstack/react-query";

export default function useCustomers() {
  return useQuery({
    queryKey: ["users", { role: "USER" }],
    queryFn: userApi.getUsersByRole,
  });
}