import categoryApi from "@/api/routes/categoryApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product, ProductDisplay } from "@/interfaces/product";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function ProductDetails({
  data,
  open,
  onOpenChange,
}: {
  data: ProductDisplay;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl! max-h-[95vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Product details</DialogTitle>
          <DialogDescription>
            View more information of product
          </DialogDescription>
        </DialogHeader>
        <Carousel className="w-full sm:max-w-xs md:max-w-lg mx-auto">
          <CarouselContent className="-ml-1">
            {data.images?.map((image) => (
              <CarouselItem key={image.id} className="basis-1/2 pl-1 lg:basis-1/3">
                <div className="relative aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={image.imageUrl}
                    alt={data.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

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
            <p className="text-justify text-base">{data.category.name}</p>
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
