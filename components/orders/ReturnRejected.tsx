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

interface ReturnRejectForm {
  returnRejectNote: string;
}

interface ReturnRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (returnRejectNote: string) => void;
}

export default function ReturnRejectDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: ReturnRejectDialogProps) {
  const { register, handleSubmit, reset } = useForm<ReturnRejectForm>();

  const handleFormSubmit = (values: ReturnRejectForm) => {
    onSubmit(values.returnRejectNote);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Từ chối yêu cầu hoàn hàng</DialogTitle>
        </DialogHeader>

        {order && (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Field>
              <FieldLabel htmlFor="return-reject-note">
                Lý do từ chối
              </FieldLabel>

              <Input
                {...register("returnRejectNote")}
                id="return-reject-note"
                type="text"
                className="h-12 rounded-lg bg-white border-gray-300"
              />
            </Field>

            <Button
              type="submit"
              variant="destructive"
              className="rounded-lg mt-4"
            >
              Từ chối hoàn hàng
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}