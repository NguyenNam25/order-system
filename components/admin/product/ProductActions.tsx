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
import { Product } from "@/types/product";
import productApi from "@/api/Routes/productApi";
import UpdateProduct from "./UpdateProduct";
import ProductDetails from "./ProductDetails";

export default function ProductActions({ product }: { product: Product}) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: productApi.deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Deleted succesfully");
    },

    onError: (error) => {
      toast.error("Deleted failed");
    },
  });

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
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
                setOpenDetails(true);
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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

      <UpdateProduct data={product} open={openUpdate} onOpenChange={setOpenUpdate} />

      <ProductDetails data={product} open={openDetails} onOpenChange={setOpenDetails}/>

      <AlertDialogDelete
        id={product.id}
        type="product"
        open={openDelete}
        onOpenChange={setOpenDelete}
        onDelete={handleDeleteProduct}
      />
    </>
  );
}
