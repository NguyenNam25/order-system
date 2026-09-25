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
import { useQuery } from "@tanstack/react-query";
import productApi from "@/api/routes/productApi";
import { formatVND } from "@/lib/format";
import Link from "next/link";

export default function Products() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAllProducts,
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {data?.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <Card className="group flex h-full flex-col">
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
              <h3 className="line-clamp-2 min-h-12 leading-6">{product.name}</h3>
              <h3 className="mt-2 text-xl text-red-600">
                {formatVND(product.price)}
              </h3>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-1.5">
              {product.quantity === 0 ? (
                <div className="flex items-center text-blue-500 justify-start">
                  <Phone className="size-4"/>
                  <span>Liên hệ</span>
                </div>
              ) : (
                <div className="flex items-center text-green-500">
                  <Check className="size-4"/>
                  <span>Còn hàng</span>
                </div>
              )}
              <div className="flex w-full justify-end gap-1.5">
                <Button size="icon" className="bg-red-600 hover:bg-red-700">
                  <ShoppingCartIcon />
                </Button>
                <Button size="icon" className="bg-gray-200 hover:bg-gray-400">
                  <Heart className="text-black" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
