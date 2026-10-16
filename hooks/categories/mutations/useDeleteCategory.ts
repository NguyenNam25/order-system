import categoryApi from "@/api/routes/categoryApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success("Deleted succesfully");
    },

    onError: (error) => {
      toast.error("Deleted failed");
    },
  });
}
