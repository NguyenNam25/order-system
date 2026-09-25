"use client";

import productApi from "@/api/routes/productApi";
import { formatVND } from "@/lib/format";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Heart, MinusIcon, PlusIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProductImage } from "@/interfaces/product";
import cartApi from "@/api/routes/cartApi";
import { toast } from "sonner";

export default function ProductDetail({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", id],
    queryFn: () => productApi.getProductById(Number(id)),
  });

  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedImage(data?.images?.[0] ?? null);
  }, [data]);

  const addToCartMutation = useMutation({
    mutationFn: () => {
      if (!data) {
        throw new Error("Product not found");
      }

      return cartApi.addToCart({
        productId: data.id,
        quantity,
      });
    },

    onSuccess: () => {
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    },

    onError: (error) => {
      console.error("Add to cart error:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    },
  });

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (!data) return;

    setQuantity((prev) => Math.min(data.quantity, prev + 1));
  };

  const handleAddToCart = () => {
    if (!data) return;

    addToCartMutation.mutate();
  };

  return (
    <div className="grid grid-cols-8 gap-4">
      <div className="flex flex-col col-span-5">
        <div>
          <div className="border rounded-lg w-full h-72 overflow-hidden">
            {selectedImage && (
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage.imageUrl}
                  alt={data?.name ?? ""}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          <Carousel className="relative w-full px-10 my-3">
            <CarouselContent className="-ml-1">
              {data?.images?.map((image) => (
                <CarouselItem
                  key={image.id}
                  className="basis-1/2 pl-1 lg:basis-1/8"
                >
                  <Button
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    variant="outline"
                    className={`relative h-auto aspect-square w-full overflow-hidden rounded-lg p-0 ${
                      selectedImage?.id === image.id
                        ? "border-primary"
                        : "border-border"
                    }`}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={data.name}
                      fill
                      className="object-cover"
                    />
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
      <div className="col-span-3 flex flex-col gap-4">
        <h1 className="font-bold text-xl">{data?.name}</h1>

        <p className="w-full h-56 overflow-y-scroll">{data?.description}</p>

        <span className="text-xl text-red-600 font-bold">
          {formatVND(data?.price ?? 0)}
        </span>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p>Số lượng: </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-md"
                onClick={handleDecrease}
                disabled={quantity <= 1}
              >
                <MinusIcon />
              </Button>
              <span className="text-base min-w-6 text-center">{quantity}</span>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-md"
                onClick={handleIncrease}
                disabled={!data || quantity >= data.quantity}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
          <Button
            type="button"
            className="w-36 rounded-lg"
            onClick={handleAddToCart}
            disabled={
              !data || data.quantity <= 0 || addToCartMutation.isPending
            }
          >
            {addToCartMutation.isPending ? "Đang thêm..." : "Add to cart"}
          </Button>
          <Button size="icon" className="bg-gray-200 hover:bg-gray-400">
            <Heart className="text-black" />
          </Button>
        </div>

        <Button className="bg-red-600 w-full h-12">Mua Ngay</Button>
      </div>
    </div>
  );
}
