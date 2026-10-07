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

interface CancelOrderForm {
  cancelNote: string;
}

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (cancelNote: string) => void;
}

export default function CancelOrderDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: CancelOrderDialogProps) {
  const { register, handleSubmit, reset } = useForm<CancelOrderForm>();

  const handleFormSubmit = (values: CancelOrderForm) => {
    onSubmit(values.cancelNote);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận hủy đơn hàng?</DialogTitle>

          {order && (
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Field>
                <FieldLabel htmlFor="cancel-note">Lí do</FieldLabel>

                <Input
                  {...register("cancelNote")}
                  id="cancel-note"
                  type="text"
                  className="h-12 rounded-lg bg-white border-gray-300"
                />
              </Field>

              <Button type="submit" variant={"destructive"} className="rounded-lg mt-4">
                Hủy đơn hàng
              </Button>
            </form>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
