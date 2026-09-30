"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import harp2 from "@/public/h1470.png";
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  useEffect(() => {
    if (data?.items) {
      setCartItems(data.items);
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
    cartItems.length > 0 && checkedProducts.length === cartItems.length;

  const updateQuantityMutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) => cartApi.updateCartItem(cartItemId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  const deleteCartItemMutation = useMutation({
    mutationFn: ({ cartItemId }: { cartItemId: number }) =>
      cartApi.deleteCartItem(cartItemId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      toast.success("đã bỏ sản phẩm khỏi giỏ hàng");
    },
  });

  const deleteAllCartItemMutation = useMutation({
    mutationFn: cartApi.deleteAllCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      toast.success("đã bỏ sản phẩm khỏi giỏ hàng");
    },
  });

  const onDeleteAllItem = () => {
    deleteAllCartItemMutation.mutate();
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col col-span-2 gap-4">
        <Card className="rounded-xl py-3">
          <CardContent className="flex items-center justify-between px-3">
            <Field orientation="horizontal">
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
              />
              <FieldLabel htmlFor="terms-checkbox-basic">Tất cả</FieldLabel>
            </Field>
            <Button
              disabled={!checkedAll || deleteAllCartItemMutation.isPending}
              size="icon"
              className="rounded-md"
              onClick={onDeleteAllItem}
            >
              <TrashIcon />
            </Button>
          </CardContent>
        </Card>
        {(data?.items ?? []).map((item) => (
          <Card key={item.id} className="rounded-xl py-3">
            <CardContent className="flex items-center justify-between px-3">
              <div className="flex items-center gap-4 w-full">
                <Checkbox
                  checked={checkedProducts.includes(String(item.productId))}
                  onCheckedChange={(checked) => {
                    const productId = String(item.productId);

                    if (checked === true) {
                      setCheckedProducts((prev) => [...prev, productId]);
                    } else {
                      setCheckedProducts((prev) =>
                        prev.filter((id) => id !== productId),
                      );
                    }
                  }}
                />

                <Image
                  src={item.product.images[0].imageUrl}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />

                <h1 className="flex-1">{item.product.name}</h1>

                <h2 className="text-red-600">
                  {formatVND(item.product.price)}
                </h2>

                <div className="flex items-center gap-2">
                  {item.quantity === 1 ? (
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-md"
                      onClick={() => {
                        deleteCartItemMutation.mutate({
                          cartItemId: item.id,
                        });
                      }}
                    >
                      <TrashIcon />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-md"
                      disabled={item.quantity <= 1}
                      onClick={() => {
                        updateQuantityMutation.mutate({
                          cartItemId: item.id,
                          quantity: item.quantity - 1,
                        });
                      }}
                    >
                      <MinusIcon />
                    </Button>
                  )}

                  <span className="text-lg">{item.quantity}</span>

                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-md"
                    disabled={item.quantity >= item.product.quantity}
                    onClick={() => {
                      updateQuantityMutation.mutate({
                        cartItemId: item.id,
                        quantity: item.quantity + 1,
                      });
                    }}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="py-4 rounded-xl ">
        <CardContent className="flex flex-col gap-4 px-4">
          <h2>Thông tin đơn hàng</h2>
          <div className="flex justify-between">
            <h2>số lượng sản phẩm</h2>
            <h2 className="font-bold">{totalQuantity}</h2>
          </div>
          <div className="flex justify-between">
            <h2>tổng tiền hàng</h2>
            <h2 className="font-bold">{formatVND(cartTotal ?? 0)}</h2>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="font-bold">Tổng tiền</h2>
              <span className="text-gray-400 text-sm">Đã bao gồm VAT</span>
            </div>
            <h2 className="text-red-600 font-bold">
              {formatVND(cartTotal ?? 0)}
            </h2>
          </div>
          <Button
            className="p-5 bg-red-600 hover:bg-red-700"
            disabled={selectedItems.length === 0}
            onClick={() => {
              const itemIds = selectedItems.map((item) => item.id).join(",");

              router.push(`/cart/payment-info?items=${itemIds}`);
            }}
          >
            MUA NGAY
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
