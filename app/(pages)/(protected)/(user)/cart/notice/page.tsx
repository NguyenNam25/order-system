"use client"

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Notice() {
    const router = useRouter()
  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <CheckCircle2 className="text-green-500 h-24 w-24" />
      <h1 className="text-2xl">Đặt hàng thành công</h1>
      <p>
        Đơn hàng của bạn đã được đặt thành công và đã được gửi cho cửa hàng để
        xác nhận
      </p>
      <Separator />
      <div className="flex gap-3">
        <Button className={"h-12 w-32"} onClick={()=>router.push("/orders")}>Xem đơn hàng</Button>
        <Button className={"h-12 w-32"} onClick={()=> router.push("/")}>Về trang chủ</Button>
      </div>
    </div>
  );
}
