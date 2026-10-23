"use client";

import productApi from "@/api/routes/productApi";
import cartApi from "@/api/routes/cartApi";
import { formatVND } from "@/lib/format";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui/button";
import {
  Heart,
  MinusIcon,
  Phone,
  PlusIcon,
  ShoppingCart,
  ShieldCheck,
  Truck,
} from "lucide-react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function ProductDetail({ id }: { id: string }) {
  const { currentUser, isLoading: authLoading } = useAuth();

  const [selectedImage, setSelectedImage] =
    useState<ProductImage | null>(null);
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const currentUrl = queryString
    ? `${pathname}?${queryString}`
    : pathname;

  const requireLogin = () => {
    if (authLoading) return false;

    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return false;
    }

    return true;
  };

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => productApi.getProductById(Number(id)),
  });

  useEffect(() => {
    setSelectedImage(data?.images?.[0] ?? null);
    setQuantity(data && data.quantity > 0 ? 1 : 0);
  }, [data]);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!data) {
        throw new Error("Product not found");
      }

      if (data.quantity <= 0 || quantity < 1 || quantity > data.quantity) {
        throw new Error("Số lượng sản phẩm không hợp lệ");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      return cartApi.addToCart({
        productId: data.id,
        quantity,
      });
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

      toast.error(
        error instanceof Error && error.message === "Số lượng sản phẩm không hợp lệ"
          ? error.message
          : "Không thể thêm sản phẩm vào giỏ hàng",
      );

      console.error("Add to cart error:", error);
    },
  });

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    if (!data) return;

    setQuantity((prev) => Math.min(data.quantity, prev + 1));
  };

  const handleAddToCart = async (): Promise<boolean> => {
    if (!requireLogin()) return false;
    if (!data || data.quantity <= 0) return false;

    try {
      await addToCartMutation.mutateAsync();
      return true;
    } catch {
      return false;
    }
  };

  const handleBuy = async () => {
    const success = await handleAddToCart();

    if (success) {
      router.push("/cart");
    }
  };

  const outOfStock = !data || data.quantity <= 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="grid animate-pulse gap-6 lg:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-[#18181B]" />
        <div className="space-y-5 rounded-2xl border border-zinc-800 bg-[#18181B] p-6">
          <div className="h-7 w-3/4 rounded bg-zinc-800" />
          <div className="h-32 rounded bg-zinc-800" />
          <div className="h-8 w-1/2 rounded bg-zinc-800" />
          <div className="h-12 rounded bg-zinc-800" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#18181B] px-4 py-16 text-center">
        <h2 className="text-lg font-semibold text-white">
          Không thể tải thông tin sản phẩm
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Vui lòng kiểm tra kết nối và thử lại.
        </p>
        <Button
          onClick={() => refetch()}
          className="mt-5 rounded-xl bg-[#FF0033] text-white hover:bg-[#E6002E]"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-zinc-100">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="transition-colors hover:text-[#FF334F]"
        >
          Trang chủ
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="transition-colors hover:text-[#FF334F]"
        >
          Sản phẩm
        </button>
        <span>/</span>
        <span className="max-w-[220px] truncate text-zinc-300">
          {data.name}
        </span>
      </div>

      {/* Main content */}
      <div className="grid items-start gap-5 lg:grid-cols-2 xl:gap-7">
        {/* Product images */}
        <section className="min-w-0 rounded-2xl border border-zinc-800 bg-[#18181B] p-3 sm:p-5">
          <div className="relative h-[300px] overflow-hidden rounded-xl border border-white/[0.05] bg-gradient-to-br from-[#242429] to-[#111114] sm:h-[360px] lg:h-[400px]">
            {selectedImage ? (
              <Image
                src={selectedImage.imageUrl}
                alt={data.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-5 transition-transform duration-500 hover:scale-105 sm:p-8"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                Chưa có hình ảnh
              </div>
            )}

            <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-semibold text-zinc-200 backdrop-blur-md">
              SHOPZONE
            </div>
          </div>

          {/* Image carousel */}
          {data.images.length > 0 && (
            <Carousel className="relative mx-1 mt-4 px-8 sm:mx-3">
              <CarouselContent className="-ml-2">
                {data.images.map((image) => (
                  <CarouselItem
                    key={image.id}
                    className="basis-1/4 pl-2 sm:basis-1/5 md:basis-1/6"
                  >
                    <button
                      type="button"
                      aria-label={`Xem ảnh sản phẩm ${image.id}`}
                      onClick={() => setSelectedImage(image)}
                      className={`relative aspect-square w-full overflow-hidden rounded-xl border bg-[#242429] transition-all ${
                        selectedImage?.id === image.id
                          ? "border-[#FF0033] ring-1 ring-[#FF0033]/40"
                          : "border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={data.name}
                        fill
                        sizes="100px"
                        className="object-contain p-2"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 border-zinc-700 bg-[#111114] text-white hover:bg-zinc-800 hover:text-white" />
              <CarouselNext className="right-0 border-zinc-700 bg-[#111114] text-white hover:bg-zinc-800 hover:text-white" />
            </Carousel>
          )}

          {/* Benefits */}
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-zinc-800 pt-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400 sm:text-sm">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#FF334F]" />
              <span>Cam kết chính hãng</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 sm:text-sm">
              <Truck className="h-5 w-5 shrink-0 text-[#FF334F]" />
              <span>Hỗ trợ giao hàng</span>
            </div>
          </div>
        </section>

        {/* Product information */}
        <section className="flex min-w-0 flex-col rounded-2xl border border-zinc-800 bg-[#18181B] p-4 sm:p-6 lg:p-7">
          <h1 className="mt-4 text-xl font-bold leading-snug text-white sm:text-2xl xl:text-3xl">
            {data.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                outOfStock
                  ? "border-zinc-700 bg-zinc-900 text-zinc-400"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  outOfStock ? "bg-zinc-500" : "bg-emerald-400"
                }`}
              />
              {outOfStock ? "Hết hàng" : "Còn hàng"}
            </span>

            {!outOfStock && (
              <span className="text-xs text-zinc-500">
                Còn {data.quantity} sản phẩm
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-zinc-200">
              Thông tin sản phẩm
            </h2>
            <p className="max-h-56 overflow-y-auto whitespace-pre-line pr-2 text-sm leading-7 text-zinc-400 [scrollbar-color:#3f3f46_transparent]">
              {data.description || "Chưa có mô tả cho sản phẩm này."}
            </p>
          </div>

          {/* Price */}
          <div className="mt-6 rounded-xl border border-[#FF0033]/20 bg-[#FF0033]/[0.06] p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              Giá bán
            </p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#FF334F] sm:text-3xl">
              {formatVND(data.price)}
            </p>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-zinc-200">
              Số lượng
            </p>

            <div className="flex items-center gap-4">
              <div className="inline-flex items-center rounded-xl border border-zinc-700 bg-[#111114] p-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Giảm số lượng"
                  className="h-9 w-9 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={handleDecrease}
                  disabled={quantity <= 1 || outOfStock}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>

                <span className="min-w-10 text-center text-sm font-bold text-white">
                  {quantity}
                </span>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Tăng số lượng"
                  className="h-9 w-9 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={handleIncrease}
                  disabled={
                    outOfStock || quantity >= data.quantity
                  }
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>

              <span className="text-xs text-zinc-500">
                {outOfStock
                  ? "Sản phẩm tạm hết hàng"
                  : `Tối đa ${data.quantity} sản phẩm`}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <Button
              type="button"
              className="h-12 rounded-xl border border-[#FF0033]/60 bg-[#FF0033] font-semibold text-white shadow-[0_4px_18px_rgba(255,0,51,0.12)] transition-all hover:bg-[#E6002E] hover:shadow-[0_4px_22px_rgba(255,0,51,0.25)] disabled:opacity-40"
              onClick={handleAddToCart}
              disabled={outOfStock || addToCartMutation.isPending}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {addToCartMutation.isPending
                ? "Đang thêm vào giỏ..."
                : "Thêm vào giỏ hàng"}
            </Button>

            <Button
              type="button"
              variant="outline"
              aria-label="Yêu thích sản phẩm"
              className="h-12 rounded-xl border-zinc-700 bg-zinc-900 px-4 text-zinc-300 hover:border-[#FF0033]/60 hover:bg-red-500/10 hover:text-[#FF334F]"
              onClick={() =>
                toast.info("Tính năng yêu thích chưa được triển khai")
              }
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {outOfStock ? (
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-12 w-full rounded-xl border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-[#FF0033]/60 hover:bg-red-500/10 hover:text-white"
              onClick={() =>
                toast.info("Vui lòng liên hệ cửa hàng để được tư vấn.")
              }
            >
              <Phone className="mr-2 h-4 w-4 text-[#FF334F]" />
              Liên hệ tư vấn
            </Button>
          ) : (
            <Button
              type="button"
              className="mt-3 h-12 w-full rounded-xl border border-zinc-600 bg-transparent font-semibold text-white transition-all hover:border-[#FF0033] hover:bg-[#FF0033]/10 hover:text-[#FF334F]"
              onClick={handleBuy}
              disabled={addToCartMutation.isPending}
            >
              Mua ngay
            </Button>
          )}

          <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
            ShopZone — Đồng hành cùng trải nghiệm gaming của bạn.
          </p>
        </section>
      </div>
    </div>
  );
}
