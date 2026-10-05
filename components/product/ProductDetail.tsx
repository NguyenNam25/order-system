"use client";

import productApi from "@/api/routes/productApi";
import { formatVND } from "@/lib/format";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Heart, MinusIcon, Phone, PlusIcon } from "lucide-react";
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
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProductDetail({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", id],
    queryFn: () => productApi.getProductById(Number(id)),
  });

  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  const [quantity, setQuantity] = useState(1);

  const router = useRouter();

  useEffect(() => {
    setSelectedImage(data?.images?.[0] ?? null);
    data?.quantity === 0 ? setQuantity(0) : setQuantity(1);
  }, [data]);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!data) {
        throw new Error("Product not found");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      return cartApi.addToCart({
        productId: data.id,
        quantity,
      });
    },

    onSuccess: () => {
      toast.success("Đã thêm sản phẩm vào giỏ hàng", { duration: 2000 });
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          router.push("/login");
          toast.error("Chưa đăng nhập");
        }
      }
      console.error("Add to cart error:", error);
    },
  });

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (!data) return;

    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = async () => {
    if (!data) return;

    await addToCartMutation.mutateAsync();
  };

  const handleBuy = async () => {
    try {
      await handleAddToCart();
      router.push("/cart");
    } catch (error) {
      console.error(error);
    }
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
                disabled={!data || data.quantity <= 0}
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
        {!data || data.quantity <= 0 ? (
          <Button className="bg-white border border-blue-500 w-full h-12">
            <div className="flex gap-2 items-center text-blue-500 justify-start">
              <Phone className="size-4" />
              <span>Liên hệ</span>
            </div>
          </Button>
        ) : (
          <Button className="bg-red-600 w-full h-12" onClick={handleBuy}>
            Mua Ngay
          </Button>
        )}
      </div>
    </div>
  );
}
