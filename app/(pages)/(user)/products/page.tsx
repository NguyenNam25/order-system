"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import harp2 from "@/public/h1470.png";
import { Check, Heart, Phone, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import productApi from "@/api/routes/productApi";
import { formatVND } from "@/lib/format";
import Link from "next/link";
import cartApi from "@/api/routes/cartApi";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Products() {
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAllProducts,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      return cartApi.addToCart({
        productId,
        quantity,
      });
    },

    onSuccess: () => {
      toast.success("Đã thêm sản phẩm vào giỏ hàng", {
        duration: 2000,
      });
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

  const handleAddToCart = async (productId: number) => {
    if (!data) return;

    setAddingProductId(productId);

    try {
      await addToCartMutation.mutateAsync({
        productId,
        quantity: 1,
      });
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {data?.map((product) => (
        <Card key={product.id} className="group flex h-full flex-col">
          <Link href={`/products/${product.id}`}>
            <CardContent className="flex flex-1 flex-col">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={product.images[0]?.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-120"
                />
              </div>
              <div className="my-2">
                <Badge variant="secondary">Secondary</Badge>
              </div>
              <h3 className="line-clamp-2 min-h-12 leading-6">
                {product.name}
              </h3>
              <h3 className="mt-2 text-xl text-red-600">
                {formatVND(product.price)}
              </h3>
            </CardContent>
          </Link>
          <CardFooter className="flex flex-col items-start gap-1.5">
            {product.quantity === 0 ? (
              <div className="flex items-center text-blue-500 justify-start">
                <Phone className="size-4" />
                <span>Liên hệ</span>
              </div>
            ) : (
              <div className="flex items-center text-green-500">
                <Check className="size-4" />
                <span>Còn hàng</span>
              </div>
            )}
            <div className="flex w-full justify-end gap-1.5">
              <Button
                size="icon"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleAddToCart(product.id)}
                disabled={
                  product.quantity <= 0 || addingProductId === product.id
                }
              >
                <ShoppingCartIcon />
              </Button>
              <Button size="icon" className="bg-gray-200 hover:bg-gray-400">
                <Heart className="text-black" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
