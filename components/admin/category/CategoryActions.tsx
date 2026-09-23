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
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import AlertDialogDelete from "../Components/AlertDialogDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category } from "@/types/category";
import UpdateCategory from "./UpdateCategory";
import categoryApi from "@/api/Routes/categoryApi";

export default function CategoryActions({ category }: { category: Category }) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const queryClient = useQueryClient();

  const deleteCategoryMutation = useMutation({
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

  const handleDeleteCategory = (id: number) => {
    deleteCategoryMutation.mutate(id);
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
                setOpenUpdate(true);
              }}
            >
              Update
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setOpenDelete(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateCategory data={category} open={openUpdate} onOpenChange={setOpenUpdate} />

      <AlertDialogDelete
        id={category.id}
        type="category"
        open={openDelete}
        onOpenChange={setOpenDelete}
        onDelete={handleDeleteCategory}
      />
    </>
  );
}
