"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Order } from "@/interfaces/order";
import { useForm } from "react-hook-form";

interface ReturnOrderForm {
  returnNote: string;
}

interface ReturnOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (returnNote: string) => void;
}

export default function ReturnOrderDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: ReturnOrderDialogProps) {
  const { register, handleSubmit, reset } = useForm<ReturnOrderForm>();

  const handleFormSubmit = (values: ReturnOrderForm) => {
    onSubmit(values.returnNote);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yêu cầu hoàn hàng</DialogTitle>

          {order && (
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Field>
                <FieldLabel htmlFor="return-note">
                  Lý do hoàn hàng
                </FieldLabel>

                <Input
                  {...register("returnNote")}
                  id="return-note"
                  type="text"
                  className="h-12 rounded-lg bg-white border-gray-300"
                />
              </Field>

              <Button type="submit" className="rounded-lg mt-4">
                Gửi yêu cầu
              </Button>
            </form>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}