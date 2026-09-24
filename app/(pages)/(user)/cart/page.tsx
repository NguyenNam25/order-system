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

export default function Cart() {
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedProducts, setCheckedProducts] = useState<string[]>([]);
  const router = useRouter();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col col-span-2 gap-4">
        <Card className="rounded-xl py-3">
          <CardContent className="flex items-center justify-between px-3">
            <Field orientation="horizontal">
              <Checkbox
                id="select-all"
                checked={checkedAll}
                onCheckedChange={(checked) => {
                  setCheckedAll(checked === true);
                }}
              />
              <FieldLabel htmlFor="terms-checkbox-basic">Tất cả</FieldLabel>
            </Field>
            <div className="flex gap-2">
              <Button>Mua ngay</Button>
              <Button size="icon" className={"rounded-md"}>
                <TrashIcon />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl py-3">
          <CardContent className="flex items-center justify-between px-3">
            <div className="flex items-center gap-4 w-full">
              <Checkbox
                id="product-1"
                checked={checkedProducts.includes("product-1")}
                onCheckedChange={(checked) => {
                  if (checked === true) {
                    setCheckedProducts((prev) => [...prev, "product-1"]);
                  } else {
                    setCheckedProducts((prev) =>
                      prev.filter((id) => id !== "product-1"),
                    );
                  }
                }}
              />

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

              <h2 className="text-red-600">890000000</h2>

              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="rounded-md">
                  <MinusIcon />
                </Button>
                <span className="text-lg">2</span>
                <Button size="icon" variant="outline" className="rounded-md">
                  <PlusIcon />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
          <Button
            className={"p-5 bg-red-600 hover:bg-red-700"}
            onClick={() => router.push("/cart/payment-info")}
          >
            MUA NGAY
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
