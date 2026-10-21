"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import cartApi from "@/api/routes/cartApi";
import orderApi from "@/api/routes/orderApi";
import { useAuth } from "@/components/auth/AuthContext";
import type { Cart } from "@/interfaces/cart";
import type { CheckoutForm } from "@/interfaces/checkout";
import CheckoutProductList from "@/components/checkout/CheckoutProductList";
import CheckoutShippingForm from "@/components/checkout/CheckoutShippingForm";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import CheckoutPaymentMethod from "@/components/checkout/CheckoutPaymentMethod";

export default function PaymentInfo() {
  const userdata = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const items = searchParams.get("items");

  const itemIds =
    items
      ?.split(",")
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0) ?? [];

  const { data, isLoading, isError } = useQuery<Cart | null>({
    queryKey: ["cart", itemIds],
    queryFn: () => cartApi.getCartItems(itemIds),
    enabled: itemIds.length > 0,
  });

  useEffect(() => {
    if (items === null || itemIds.length === 0) {
      router.replace("/cart");
    }
  }, [items, itemIds.length, router]);

  const { register, handleSubmit, reset } = useForm<CheckoutForm>({
    defaultValues: {
      receiverName: "",
      phone: "",
      address: "",
      note: "",
    },
  });

  useEffect(() => {
    if (userdata.currentUser) {
      reset({
        receiverName: userdata.currentUser.fullname ?? "",
        phone: userdata.currentUser.phone ?? "",
        address: "",
        note: "",
      });
    }
  }, [userdata.currentUser, reset]);

  const createOrderMutation = useMutation({
    mutationFn: orderApi.createOrder,

    onSuccess: () => {
      toast.success("Đặt hàng thành công");
      router.push("/cart/notice");
    },

    onError: (error: unknown) => {
      console.error("Create order error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Không thể tạo đơn hàng");
        return;
      }

      toast.error("Không thể tạo đơn hàng");
    },
  });

  const totalQuantity =
    data?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const cartTotal =
    data?.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ) ?? 0;

  const onSubmit = (formData: CheckoutForm) => {
    createOrderMutation.mutate({
      receiverName: formData.receiverName,
      phone: formData.phone,
      address: formData.address,
      note: formData.note,
      itemIds,
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#09090B] p-6 text-zinc-100">
        <p className="text-zinc-400">Đang tải thông tin thanh toán...</p>
      </main>
    );
  }

  if (isError || !data || data.items.length === 0) {
    return (
      <main className="min-h-screen bg-[#09090B] p-6 text-zinc-100">
        <p className="text-zinc-400">
          Không thể tải giỏ hàng hoặc không có sản phẩm để thanh toán.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-6 text-zinc-100 sm:py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-7xl px-4 sm:px-6"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <CheckoutProductList items={data.items} />

            <CheckoutShippingForm register={register} />
          </div>

          <div className="space-y-6">
            <CheckoutOrderSummary
              totalQuantity={totalQuantity}
              cartTotal={cartTotal}
            />

            <CheckoutPaymentMethod
              isPending={createOrderMutation.isPending}
              isDisabled={isLoading || data.items.length === 0}
            />
          </div>
        </div>
      </form>
    </main>
  );
}
