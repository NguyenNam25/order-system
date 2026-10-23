import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import AlertDialogDelete from "@/components/layout-components/AlertDialogDelete";
import { ProductDisplay } from "@/interfaces/product";
import UpdateProduct from "./UpdateProduct";
import ProductDetails from "./ProductDetails";
import { useDeleteProduct } from "@/hooks/products/mutations/useDeleteProduct";

export default function ProductActions({
  product,
}: {
  product: ProductDisplay;
}) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const deleteProductMutation = useDeleteProduct();

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

      <UpdateProduct
        data={product}
        open={openUpdate}
        onOpenChange={setOpenUpdate}
      />

      <ProductDetails
        data={product}
        open={openDetails}
        onOpenChange={setOpenDetails}
      />

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
