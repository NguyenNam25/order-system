import userApi from "@/api/routes/userApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Deleted succesfully");
    },

    onError: () => {
      toast.error("Deleted failed");
    },
  });
}
