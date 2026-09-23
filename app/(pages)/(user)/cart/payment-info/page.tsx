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
import { useState } from "react";
import Image from "next/image";
import harp2 from "@/public/h1470.png";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PaymentInfo() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col col-span-2 gap-4">
        <Card className="rounded-xl py-3">
          <CardContent className="flex flex-col px-3">
            <h1>Danh sách sản phẩm</h1>
            <div className="flex items-center gap-4 w-full">
              <Image
                src={harp2}
                alt="ROG Harpe II Extreme Edition 20 Gaming Mouse"
                width={64}
                height={64}
                className="object-contain"
              />
              <h1 className="flex-1">
                ROG Harpe II Extreme Edition 20 Gaming Mouse
              </h1>
              <h2>Số lượng: 2</h2>
              <h2 className="text-red-600">890000000</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl py-3">
          <CardContent className="flex flex-col px-3">
            <h1>Thông tin giao hàng</h1>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel>Tên người nhận</FieldLabel>
                <Input className="h-12 rounded-lg bg-white border-gray-300" />
              </Field>
              <Field>
                <FieldLabel>Số điện thoại người nhận</FieldLabel>
                <Input className="h-12 rounded-lg bg-white border-gray-300" />
              </Field>
              <h1 className="col-span-2">Địa chỉ nhận hàng</h1>
              <Field>
                <FieldLabel>Tỉnh/Thành phố</FieldLabel>
                <Input className="h-12 rounded-lg bg-white border-gray-300" />
              </Field>
              <Field>
                <FieldLabel>Quận/Huyện</FieldLabel>
                <Input className="h-12 rounded-lg bg-white border-gray-300" />
              </Field>
              <Field>
                <FieldLabel>Phường/Xã</FieldLabel>
                <Input className="h-12 rounded-lg bg-white border-gray-300" />
              </Field>
              <Field>
                <FieldLabel>Địa chỉ</FieldLabel>
                <Input className="h-12 rounded-lg bg-white border-gray-300" />
              </Field>
              <Field className="col-span-2">
                <FieldLabel>Ghi chú</FieldLabel>
                <Textarea className="h-20 rounded-lg bg-white border-gray-300" />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="py-4 rounded-xl ">
          <CardContent className="flex flex-col gap-4 px-4">
            <h2>Thông tin đơn hàng</h2>
            <div className="flex justify-between">
              <h2>số lượng sản phẩm</h2>
              <h2 className="font-bold">2</h2>
            </div>
            <div className="flex justify-between">
              <h2>tổng tiền hàng</h2>
              <h2 className="font-bold">890000000</h2>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h2 className="font-bold">Tổng tiền</h2>
                <span className="text-gray-400 text-sm">Đã bao gồm VAT</span>
              </div>
              <h2 className="text-red-600 font-bold">890000000</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="py-4 rounded-xl ">
          <CardContent className="flex flex-col gap-4 px-4">
            <h2>Phương thức thanh toán</h2>
            <h2>Thanh toán khi nhận hàng</h2>
            <Separator />
            <Button className={"bg-red-600 hover:bg-red-700 p-5"} onClick={()=>router.push("/cart/notice")}>
              Thanh toán
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
