import type { UseFormRegister } from "react-hook-form";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CheckoutForm } from "@/interfaces/checkout";

interface CheckoutShippingFormProps {
  register: UseFormRegister<CheckoutForm>;
}

const inputClassName =
  "h-11 rounded-lg border-white/10 bg-[#111114] text-zinc-100 placeholder:text-zinc-500 focus-visible:border-[#FF0033] focus-visible:ring-[#FF0033]/20";

export default function CheckoutShippingForm({
  register,
}: CheckoutShippingFormProps) {
  return (
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
            <FieldLabel htmlFor="receiverName" className="text-zinc-300">
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
  );
}
