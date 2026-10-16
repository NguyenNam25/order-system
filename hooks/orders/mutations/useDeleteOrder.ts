import orderApi from "@/api/routes/orderApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.deleteOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}
