"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { PackageCheck, MapPin, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import cartApi from "@/api/routes/cartApi";
import orderApi from "@/api/routes/orderApi";
import { formatVND } from "@/lib/format";
import { useAuth } from "@/components/auth/AuthContext";
import { Cart } from "@/interfaces/cart";
import { toast } from "sonner";
import axios from "axios";

interface CheckoutForm {
  receiverName: string;
  phone: string;
  address: string;
  note: string;
}

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

    onError: (error) => {
      console.error("Create order error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? "Không thể tạo đơn hàng",
        );
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

  const inputClassName =
    "h-11 rounded-lg border-white/10 bg-[#111114] text-zinc-100 placeholder:text-zinc-500 focus-visible:border-[#FF0033] focus-visible:ring-[#FF0033]/20";

  return (
    <main className="min-h-screen bg-[#09090B] py-6 text-zinc-100 sm:py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10"
      >
        {/* Tiêu đề */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
            <span
              className="cursor-pointer transition hover:text-white"
              onClick={() => router.push("/cart")}
            >
              Giỏ hàng
            </span>
            <span>/</span>
            <span className="text-[#FF334F]">Thanh toán</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Hoàn tất đơn hàng
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Kiểm tra sản phẩm và điền thông tin để hoàn tất đặt hàng.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-white/[0.06] bg-[#18181B] p-10 text-center text-zinc-400">
            Đang tải thông tin đơn hàng...
          </div>
        ) : isError || !data ? (
          <div className="rounded-xl border border-red-500/20 bg-[#18181B] p-8 text-center">
            <p className="font-medium text-zinc-100">
              Không thể tải thông tin sản phẩm.
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Vui lòng quay lại giỏ hàng và thử lại.
            </p>
            <Button
              type="button"
              onClick={() => router.push("/cart")}
              className="mt-5 bg-[#FF0033] text-white hover:bg-[#D9002B]"
            >
              Quay lại giỏ hàng
            </Button>
          </div>
        ) : data.items.length === 0 ? (
          <div className="rounded-xl border border-white/[0.06] bg-[#18181B] p-10 text-center">
            <ShoppingBag className="mx-auto mb-3 size-10 text-zinc-500" />
            <p className="font-medium">Không có sản phẩm để thanh toán.</p>
            <Button
              type="button"
              onClick={() => router.push("/cart")}
              className="mt-5 bg-[#FF0033] hover:bg-[#D9002B]"
            >
              Quay lại giỏ hàng
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3 lg:gap-6">
            {/* Cột thông tin */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              {/* Danh sách sản phẩm */}
              <Card className="gap-0 overflow-hidden rounded-xl border-white/[0.07] bg-[#18181B] py-0 text-zinc-100">
                <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#FF0033]/10">
                    <ShoppingBag className="size-5 text-[#FF334F]" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Sản phẩm đã chọn</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {data.items.length} sản phẩm trong đơn hàng
                    </p>
                  </div>
                </div>

                <CardContent className="px-4 py-2 sm:px-6">
                  <div className="divide-y divide-white/[0.06]">
                    {data.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-4 sm:gap-5"
                      >
                        <div className="flex size-[76px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-[#242429] sm:size-[92px]">
                          {item.product.images?.[0]?.imageUrl ? (
                            <Image
                              src={item.product.images[0].imageUrl}
                              alt={item.product.name}
                              width={92}
                              height={92}
                              className="size-full object-contain p-2"
                            />
                          ) : (
                            <ShoppingBag className="size-7 text-zinc-600" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-medium leading-5 text-zinc-100 sm:text-base">
                            {item.product.name}
                          </h3>
                          <p className="mt-2 text-xs text-zinc-500">
                            Số lượng: {item.quantity}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-[#FF334F] sm:text-base">
                            {formatVND(item.product.price * item.quantity)}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {formatVND(item.product.price)}/sp
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin giao hàng */}
              <Card className="gap-0 rounded-xl border-white/[0.07] bg-[#18181B] py-0 text-zinc-100">
                <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#FF0033]/10">
                    <MapPin className="size-5 text-[#FF334F]" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Thông tin giao hàng</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Nhập thông tin nhận hàng của bạn
                    </p>
                  </div>
                </div>

                <CardContent className="px-5 py-5 sm:px-6 sm:py-6">
                  <FieldGroup className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel
                        htmlFor="receiverName"
                        className="text-zinc-300"
                      >
                        Tên người nhận
                      </FieldLabel>
                      <Input
                        {...register("receiverName", {
                          required: "Vui lòng nhập tên người nhận",
                        })}
                        id="receiverName"
                        autoComplete="name"
                        placeholder="Nhập tên người nhận"
                        className={inputClassName}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="phone" className="text-zinc-300">
                        Số điện thoại
                      </FieldLabel>
                      <Input
                        {...register("phone", {
                          required: "Vui lòng nhập số điện thoại",
                          pattern: {
                            value: /^[0-9+()\-\s]{9,15}$/,
                            message: "Số điện thoại không hợp lệ",
                          },
                        })}
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="Nhập số điện thoại"
                        className={inputClassName}
                      />
                    </Field>

                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="address" className="text-zinc-300">
                        Địa chỉ nhận hàng
                      </FieldLabel>
                      <Input
                        {...register("address", {
                          required: "Vui lòng nhập địa chỉ nhận hàng",
                        })}
                        id="address"
                        autoComplete="street-address"
                        placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                        className={inputClassName}
                      />
                    </Field>

                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="note" className="text-zinc-300">
                        Ghi chú{" "}
                        <span className="font-normal text-zinc-500">
                          (không bắt buộc)
                        </span>
                      </FieldLabel>
                      <Input
                        {...register("note")}
                        id="note"
                        placeholder="Lưu ý khi giao hàng..."
                        className={inputClassName}
                      />
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>
            </div>

            {/* Cột tổng kết đơn hàng */}
            <aside className="flex flex-col gap-5 lg:sticky lg:top-6">
              <Card className="gap-0 rounded-xl border-white/[0.07] bg-[#18181B] py-0 text-zinc-100">
                <div className="border-b border-white/[0.06] px-5 py-4">
                  <h2 className="font-semibold">Tóm tắt đơn hàng</h2>
                </div>

                <CardContent className="flex flex-col gap-4 px-5 py-5">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-zinc-400">Số lượng sản phẩm</span>
                    <span className="font-medium">{totalQuantity}</span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-zinc-400">Tạm tính</span>
                    <span className="font-medium">
                      {formatVND(cartTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-zinc-400">Phí vận chuyển</span>
                    <span className="font-medium text-emerald-400">
                      Miễn phí
                    </span>
                  </div>

                  <Separator className="bg-white/[0.08]" />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">Tổng thanh toán</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Đã bao gồm VAT (nếu có)
                      </p>
                    </div>
                    <p className="text-xl font-bold tracking-tight text-[#FF334F]">
                      {formatVND(cartTotal)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="gap-0 rounded-xl border-white/[0.07] bg-[#18181B] py-0 text-zinc-100">
                <CardContent className="px-5 py-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Truck className="size-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold">
                        Thanh toán khi nhận hàng
                      </h2>
                      <p className="mt-1 text-xs text-zinc-500">
                        COD · Trả tiền khi giao hàng
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 rounded-lg border border-white/[0.06] bg-[#111114] p-3">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <PackageCheck className="size-4 shrink-0 text-[#FF334F]" />
                      Kiểm tra hàng khi nhận
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      createOrderMutation.isPending ||
                      isLoading ||
                      !data?.items.length
                    }
                    className="h-12 w-full rounded-lg bg-[#FF0033] font-semibold text-white transition hover:bg-[#D9002B] disabled:opacity-50"
                  >
                    {createOrderMutation.isPending
                      ? "Đang đặt hàng..."
                      : "Xác nhận đặt hàng"}
                  </Button>

                  <p className="mt-3 text-center text-xs leading-5 text-zinc-500">
                    Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </form>
    </main>
  );
}
