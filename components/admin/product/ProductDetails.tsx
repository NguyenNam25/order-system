import categoryApi from "@/api/Routes/categoryApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";

export default function ProductDetails({
  data,
  open,
  onOpenChange,
}: {
  data: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: category } = useQuery({
    queryKey: ["category", data.categoryId],
    queryFn: () => categoryApi.getCategoryById(data.categoryId),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Product details</DialogTitle>
          <DialogDescription>
            View more information of product
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="p-1 rounded-lg flex items-center justify-between my-1">
            <div className="flex items-center gap-3">
              <h1 className="text-lg">ID:</h1>
              <p className="text-justify text-base">{data.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg">Price:</h1>
              <p className="text-justify text-base">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(data.price)}
              </p>
            </div>
          </div>
          <Separator />
          <div className="p-1 rounded-lg flex items-center gap-3 my-1">
            <h1 className="text-lg">Name:</h1>
            <p className="text-justify text-base">{data.name}</p>
          </div>
          <Separator />
          <div className="p-1 rounded-lg flex items-center gap-3 my-1">
            <h1 className="text-lg">Category:</h1>
            <p className="text-justify text-base">{category?.name}</p>
          </div>
          <Separator />
          <div className="p-1 rounded-lg my-1">
            <h1 className="pb-2 text-lg">Description:</h1>
            <p className="text-justify">{data.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}