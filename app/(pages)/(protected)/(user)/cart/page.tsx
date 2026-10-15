"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  MinusIcon,
  PlusIcon,
  ShoppingCart,
  TrashIcon,
  PackageCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartApi from "@/api/routes/cartApi";
import { formatVND } from "@/lib/format";
import { CartItem } from "@/interfaces/cart";
import { toast } from "sonner";

export default function Cart() {
  const [checkedProducts, setCheckedProducts] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  useEffect(() => {
    if (data?.items) {
      setCartItems(data.items);
    }
  }, [data]);

  // Chỉ giữ các lựa chọn còn tồn tại trong giỏ hàng
  useEffect(() => {
    if (data?.items) {
      const productIds = new Set(
        data.items.map((item) => String(item.productId)),
      );

      setCheckedProducts((prev) =>
        prev.filter((id) => productIds.has(id)),
      );
    }
  }, [data]);

  const selectedItems = cartItems.filter((item) =>
    checkedProducts.includes(String(item.productId)),
  );

  const totalQuantity = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = selectedItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const checkedAll =
    cartItems.length > 0 &&
    cartItems.every((item) =>
      checkedProducts.includes(String(item.productId)),
    );

  const updateQuantityMutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) => cartApi.updateCartItem(cartItemId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: () => {
      toast.error("Không thể cập nhật số lượng sản phẩm");
    },
  });

  const deleteCartItemMutation = useMutation({
    mutationFn: ({ cartItemId }: { cartItemId: number }) =>
      cartApi.deleteCartItem(cartItemId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Đã bỏ sản phẩm khỏi giỏ hàng");
    },

    onError: () => {
      toast.error("Không thể xóa sản phẩm");
    },
  });

  const deleteAllCartItemMutation = useMutation({
    mutationFn: cartApi.deleteAllCartItem,

    onSuccess: () => {
      setCheckedProducts([]);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Đã xóa toàn bộ sản phẩm khỏi giỏ hàng");
    },

    onError: () => {
      toast.error("Không thể xóa giỏ hàng");
    },
  });

  const onDeleteAllItem = () => {
    deleteAllCartItemMutation.mutate();
  };

  // Loading
  if (isLoading) {
    return (
      <div className="grid animate-pulse gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl border border-zinc-800 bg-[#18181B]"
            />
          ))}
        </div>
        <div className="h-72 rounded-2xl border border-zinc-800 bg-[#18181B]" />
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#18181B] px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-10 w-10 text-[#FF334F]" />
        <h2 className="mt-4 font-semibold text-white">
          Không thể tải giỏ hàng
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
    <div className="space-y-6 text-zinc-100">
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF334F]">
            SHOPZONE / YOUR CART
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Giỏ hàng của bạn
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Kiểm tra sản phẩm và lựa chọn những món hàng bạn muốn mua.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#18181B] px-3 py-2 text-sm text-zinc-300">
          <ShoppingCart className="h-4 w-4 text-[#FF334F]" />
          {cartItems.length} sản phẩm
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#18181B] px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900">
            <ShoppingCart className="h-7 w-7 text-[#FF334F]" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">
            Giỏ hàng đang trống
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Hãy khám phá các sản phẩm và chọn món đồ yêu thích của bạn.
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="mt-6 rounded-xl bg-[#FF0033] font-semibold text-white hover:bg-[#E6002E]"
          >
            Khám phá sản phẩm
          </Button>
        </div>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_370px]">
          {/* Cart items */}
          <section className="min-w-0 space-y-4">
            <Card className="rounded-2xl border-zinc-800 bg-[#18181B] py-0 shadow-lg shadow-black/10">
              <CardContent className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
                <label className="flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={checkedAll}
                    onCheckedChange={(checked) => {
                      if (checked === true) {
                        setCheckedProducts(
                          cartItems.map((item) => String(item.productId)),
                        );
                      } else {
                        setCheckedProducts([]);
                      }
                    }}
                    className="border-zinc-600 data-[state=checked]:border-[#FF0033] data-[state=checked]:bg-[#FF0033]"
                  />
                  <span className="text-sm font-medium text-zinc-200">
                    Chọn tất cả
                  </span>
                </label>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={
                    !checkedAll || deleteAllCartItemMutation.isPending
                  }
                  onClick={onDeleteAllItem}
                  className="rounded-lg border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-[#FF0033]/60 hover:bg-red-500/10 hover:text-[#FF334F] disabled:opacity-40"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Xóa tất cả
                </Button>
              </CardContent>
            </Card>

            {cartItems.map((item) => {
              const selected = checkedProducts.includes(
                String(item.productId),
              );
              const noStock = item.product.quantity <= 0;

              return (
                <Card
                  key={item.id}
                  className={`group rounded-2xl border bg-[#18181B] py-0 transition-all duration-200 ${
                    selected
                      ? "border-[#FF0033]/50 shadow-[0_0_20px_rgba(255,0,51,0.05)]"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <CardContent className="flex gap-3 p-3 sm:gap-4 sm:p-5">
                    <div className="flex items-start pt-2">
                      <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => {
                          const productId = String(item.productId);

                          if (checked === true) {
                            setCheckedProducts((prev) =>
                              prev.includes(productId)
                                ? prev
                                : [...prev, productId],
                            );
                          } else {
                            setCheckedProducts((prev) =>
                              prev.filter((id) => id !== productId),
                            );
                          }
                        }}
                        className="border-zinc-600 data-[state=checked]:border-[#FF0033] data-[state=checked]:bg-[#FF0033]"
                      />
                    </div>

                    {/* Product image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.05] bg-[#242429] sm:h-28 sm:w-28">
                      {item.product.images?.[0]?.imageUrl ? (
                        <Image
                          src={item.product.images[0].imageUrl}
                          alt={item.product.name}
                          fill
                          sizes="112px"
                          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105 sm:p-3"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-zinc-500">
                          Chưa có ảnh
                        </div>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <h2 className="line-clamp-2 text-sm font-semibold leading-6 text-zinc-100 transition-colors group-hover:text-[#FF334F] sm:text-base">
                          {item.product.name}
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                          {noStock
                            ? "Sản phẩm đã hết hàng"
                            : `Tồn kho: ${item.product.quantity}`}
                        </p>

                        <p className="mt-2 text-sm font-bold text-[#FF334F] sm:hidden">
                          {formatVND(item.product.price)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                        <p className="hidden text-sm font-bold text-[#FF334F] sm:block">
                          {formatVND(item.product.price)}
                        </p>

                        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-[#111114] p-1">
                          {item.quantity === 1 ? (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              aria-label="Xóa sản phẩm"
                              className="h-7 w-7 rounded-md text-zinc-400 hover:bg-red-500/10 hover:text-[#FF334F]"
                              disabled={deleteCartItemMutation.isPending}
                              onClick={() =>
                                deleteCartItemMutation.mutate({
                                  cartItemId: item.id,
                                })
                              }
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              aria-label="Giảm số lượng"
                              className="h-7 w-7 rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white"
                              disabled={updateQuantityMutation.isPending}
                              onClick={() =>
                                updateQuantityMutation.mutate({
                                  cartItemId: item.id,
                                  quantity: item.quantity - 1,
                                })
                              }
                            >
                              <MinusIcon className="h-4 w-4" />
                            </Button>
                          )}

                          <span className="min-w-6 text-center text-sm font-semibold text-white">
                            {item.quantity}
                          </span>

                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label="Tăng số lượng"
                            className="h-7 w-7 rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white"
                            disabled={
                              updateQuantityMutation.isPending ||
                              noStock ||
                              item.quantity >= item.product.quantity
                            }
                            onClick={() =>
                              updateQuantityMutation.mutate({
                                cartItemId: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-24">
            <Card className="rounded-2xl border-zinc-800 bg-[#18181B] py-0 shadow-lg shadow-black/20">
              <CardContent className="space-y-5 p-4 sm:p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF334F]">
                    ORDER SUMMARY
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-white">
                    Thông tin đơn hàng
                  </h2>
                </div>

                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-zinc-400">Sản phẩm đã chọn</span>
                  <span className="font-semibold text-zinc-100">
                    {selectedItems.length}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-zinc-400">Tổng số lượng</span>
                  <span className="font-semibold text-zinc-100">
                    {totalQuantity}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-zinc-400">Tổng tiền hàng</span>
                  <span className="font-semibold text-zinc-100">
                    {formatVND(cartTotal)}
                  </span>
                </div>

                <Separator className="bg-zinc-800" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-white">
                      Tổng thanh toán
                    </span>
                    <span className="text-lg font-extrabold text-[#FF334F] sm:text-xl">
                      {formatVND(cartTotal)}
                    </span>
                  </div>
                  <p className="text-right text-xs text-zinc-500">
                    Đã bao gồm VAT nếu có
                  </p>
                </div>

                <Button
                  type="button"
                  className="h-12 w-full rounded-xl bg-[#FF0033] font-bold tracking-wide text-white shadow-[0_4px_18px_rgba(255,0,51,0.15)] transition-all hover:bg-[#E6002E] hover:shadow-[0_4px_22px_rgba(255,0,51,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={selectedItems.length === 0}
                  onClick={() => {
                    const itemIds = selectedItems
                      .map((item) => item.id)
                      .join(",");

                    router.push(`/cart/payment-info?items=${itemIds}`);
                  }}
                >
                  TIẾN HÀNH THANH TOÁN
                </Button>

                <div className="flex items-start gap-2 rounded-xl border border-zinc-800 bg-[#111114] p-3">
                  <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FF334F]" />
                  <p className="text-xs leading-5 text-zinc-400">
                    Vui lòng kiểm tra sản phẩm và số lượng trước khi đặt hàng.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  onClick={() => router.push("/products")}
                >
                  Tiếp tục mua sắm
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
