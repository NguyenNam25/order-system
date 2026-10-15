"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Check, Heart, Phone, ShoppingCart, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";
import productApi from "@/api/routes/productApi";
import cartApi from "@/api/routes/cartApi";
import { formatVND } from "@/lib/format";

export default function Products() {
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const { currentUser, isLoading: authLoading } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;

  const requireLogin = () => {
    if (authLoading) return false;

    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return false;
    }

    return true;
  };

  const { data, isLoading, isError, refetch } = useQuery({
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
      return cartApi.addToCart({ productId, quantity });
    },

    onSuccess: () => {
      toast.success("Đã thêm sản phẩm vào giỏ hàng", {
        duration: 2000,
      });
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
        return;
      }

      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
      console.error("Add to cart error:", error);
    },
  });

  const handleAddToCart = async (productId: number) => {
    if (!requireLogin()) return;
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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111114] p-2.5 sm:p-3"
          >
            <div className="aspect-square animate-pulse rounded-xl bg-zinc-800" />
            <div className="mt-4 h-4 animate-pulse rounded bg-zinc-800" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
            <div className="mt-5 h-6 w-1/2 animate-pulse rounded bg-zinc-800" />
            <div className="mt-4 h-9 animate-pulse rounded-lg bg-zinc-800" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#111114] px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-[#FF0033]">
          <ShoppingCart className="h-6 w-6" />
        </div>

        <h3 className="mt-4 font-semibold text-white">
          Không thể tải sản phẩm
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Đã xảy ra lỗi khi kết nối. Vui lòng thử lại.
        </p>

        <Button
          variant="outline"
          className="mt-5 rounded-xl border-zinc-700 bg-zinc-900 text-white hover:border-[#FF0033] hover:bg-red-500/10 hover:text-white"
          onClick={() => refetch()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  // Empty state
  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700 bg-[#111114] px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400">
          <ShoppingCart className="h-6 w-6" />
        </div>

        <h3 className="mt-4 font-semibold text-white">Chưa có sản phẩm</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Các sản phẩm sẽ xuất hiện tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {data.map((product) => {
        const outOfStock = product.quantity <= 0;
        const isAdding = addingProductId === product.id;

        return (
          <Card
            key={product.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#18181B] py-0 shadow-md shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF0033]/70 hover:shadow-[0_12px_35px_rgba(255,0,51,0.14)]"
          >
            <Link
              href={`/products/${product.id}`}
              className="flex flex-1 flex-col"
            >
              {/* Product image */}
              <div className="relative m-2.5 mb-0 aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-[#242429] sm:m-3.5 sm:mb-0"  >
                {product.images[0]?.imageUrl ? (
                  <Image
                    src={product.images[0].imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                    className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105 sm:p-5"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-xs text-zinc-500 sm:text-sm">
                    Chưa có hình ảnh
                  </div>
                )}

                {/* Stock badge */}
                <Badge
                  variant="secondary"
                  className={`absolute left-2 top-2 rounded-full border px-2 py-1 text-[10px] font-medium shadow-sm backdrop-blur-md sm:left-3 sm:top-3 sm:text-xs ${
                    outOfStock
                      ? "border-zinc-700 bg-black/70 text-zinc-400"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  <span
                    className={`mr-1 h-1.5 w-1.5 rounded-full ${
                      outOfStock ? "bg-zinc-500" : "bg-emerald-400"
                    }`}
                  />
                  {outOfStock ? "Hết hàng" : "Còn hàng"}
                </Badge>

                {/* Detail indicator */}
                <div className="absolute bottom-2 right-2 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-3 sm:right-3">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              {/* Product information */}
              <CardContent className="flex flex-1 flex-col px-3 pb-3 pt-3.5 sm:px-4 sm:pb-4 sm:pt-4">
                <h3 className="line-clamp-2 min-h-10 text-[13px] font-semibold leading-5 text-zinc-200 transition-colors duration-200 group-hover:text-[#FF334F] sm:min-h-12 sm:text-sm sm:leading-6">
                  {product.name}
                </h3>

                <div className="mt-auto border-t border-zinc-800/80 pt-3">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 sm:text-[11px]">
                    Giá bán
                  </p>
                  <p className="mt-1 text-base font-bold tracking-tight text-[#FF334F] sm:text-lg">
                    {formatVND(product.price)}
                  </p>
                </div>
              </CardContent>
            </Link>

            {/* Product actions */}
            <CardFooter className="flex flex-col items-stretch gap-3 border-t border-zinc-800 bg-black/20 px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
              <div
                className={`flex items-center gap-1.5 text-[11px] sm:text-xs ${
                  outOfStock ? "text-zinc-500" : "text-emerald-400"
                }`}
              >
                {outOfStock ? (
                  <>
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>Liên hệ để biết thêm</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>Có sẵn trong kho</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="h-9 min-w-0 flex-1 gap-1.5 rounded-xl border border-[#FF0033]/60 bg-[#FF0033] px-2 text-xs font-semibold text-white shadow-[0_3px_12px_rgba(255,0,51,0.12)] transition-all duration-200 hover:border-[#ff335b] hover:bg-[#e6002e] hover:shadow-[0_4px_18px_rgba(255,0,51,0.25)] disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:gap-2 sm:text-sm"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={outOfStock || isAdding || authLoading}
                >
                  <ShoppingCart className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {isAdding ? "Đang thêm..." : "Thêm giỏ"}
                  </span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Yêu thích sản phẩm"
                  className="h-9 w-9 shrink-0 rounded-xl border-zinc-700 bg-zinc-900 text-zinc-400 transition-all duration-200 hover:border-[#FF0033]/60 hover:bg-red-500/10 hover:text-[#FF334F] sm:h-10 sm:w-10"
                  onClick={() =>
                    toast.info("Tính năng yêu thích chưa được triển khai")
                  }
                >
                  <Heart className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
