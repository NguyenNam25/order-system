"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import cartApi from "@/api/routes/cartApi";
import { formatVND } from "@/lib/format";
import { useAuth } from "@/components/auth/AuthContext";
import { useForm } from "react-hook-form";
import orderApi from "@/api/routes/orderApi";
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

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<CheckoutForm>({
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  const createOrderMutation = useMutation({
    mutationFn: orderApi.createOrder,

    onSuccess: (order) => {
      toast.success("Đặt hàng thành công");

      router.push(`/cart/notice`);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
      }
      console.error("Create order error:", error);

      toast.error("Không thể tạo đơn hàng");
    },
  });

  const totalQuantity = data?.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = data?.items.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0,
  );

  const onSubmit = (formData: CheckoutForm) => {
    createOrderMutation.mutate({
      receiverName: formData.receiverName,
      phone: formData.phone,
      address: formData.address,
      note: formData.note,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col col-span-2 gap-4">
          <Card className="rounded-xl py-3">
            <CardContent className="flex flex-col px-3">
              <h1>Danh sách sản phẩm</h1>

              {data?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 w-full"
                >
                  <Image
                    src={item.product.images[0].imageUrl}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />

                  <h1 className="flex-1">
                    {item.product.name}
                  </h1>

                  <h2>
                    Số lượng: {item.quantity}
                  </h2>

                  <h2 className="text-red-600">
                    {formatVND(item.product.price)}
                  </h2>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-xl py-3">
            <CardContent className="flex flex-col px-3">
              <h1>Thông tin giao hàng</h1>

              <FieldGroup className="grid grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="receiverName">
                    Tên người nhận
                  </FieldLabel>

                  <Input
                    {...register("receiverName")}
                    id="receiverName"
                    type="text"
                    className="h-12 rounded-lg bg-white border-gray-300"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">
                    Số điện thoại người nhận
                  </FieldLabel>

                  <Input
                    {...register("phone")}
                    id="phone"
                    type="text"
                    className="h-12 rounded-lg bg-white border-gray-300"
                  />
                </Field>

                <Field className="col-span-2">
                  <FieldLabel htmlFor="address">
                    Địa chỉ
                  </FieldLabel>

                  <Input
                    {...register("address")}
                    id="address"
                    type="text"
                    className="h-12 rounded-lg bg-white border-gray-300"
                  />
                </Field>

                <Field className="col-span-2">
                  <FieldLabel htmlFor="note">
                    Ghi chú
                  </FieldLabel>

                  <Input
                    {...register("note")}
                    id="note"
                    type="text"
                    className="h-12 rounded-lg bg-white border-gray-300"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="py-4 rounded-xl">
            <CardContent className="flex flex-col gap-4 px-4">
              <h2>Thông tin đơn hàng</h2>

              <div className="flex justify-between">
                <h2>Số lượng sản phẩm</h2>
                <h2 className="font-bold">
                  {totalQuantity ?? 0}
                </h2>
              </div>

              <div className="flex justify-between">
                <h2>Tổng tiền hàng</h2>
                <h2 className="font-bold">
                  {formatVND(cartTotal ?? 0)}
                </h2>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h2 className="font-bold">Tổng tiền</h2>
                  <span className="text-gray-400 text-sm">
                    Đã bao gồm VAT
                  </span>
                </div>

                <h2 className="text-red-600 font-bold">
                  {formatVND(cartTotal ?? 0)}
                </h2>
              </div>
            </CardContent>
          </Card>

          <Card className="py-4 rounded-xl">
            <CardContent className="flex flex-col gap-4 px-4">
              <h2>Phương thức thanh toán</h2>

              <h2>Thanh toán khi nhận hàng</h2>

              <Separator />

              <Button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="bg-red-600 hover:bg-red-700 p-5"
              >
                {createOrderMutation.isPending
                  ? "Đang đặt hàng..."
                  : "Thanh toán"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}