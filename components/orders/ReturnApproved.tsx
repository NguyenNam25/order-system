"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Order } from "@/interfaces/order";

interface ReturnApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (returnMethod: "REFUND" | "EXCHANGE") => void;
}

export default function ReturnApproveDialog({
  open,
  onOpenChange,
  order,
  onSubmit,
}: ReturnApproveDialogProps) {
  const handleSubmit = (returnMethod: "REFUND" | "EXCHANGE") => {
    onSubmit(returnMethod);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duyệt yêu cầu hoàn hàng</DialogTitle>
        </DialogHeader>

        {order && (
          <div className="flex flex-col gap-3">
            <p>
              Bạn muốn xử lý yêu cầu hoàn hàng của đơn{" "}
              <strong>{order.orderCode}</strong> như thế nào?
            </p>

            <Button
              onClick={() => handleSubmit("REFUND")}
              className="rounded-lg"
            >
              Hoàn tiền
            </Button>

            <Button
              onClick={() => handleSubmit("EXCHANGE")}
              variant="outline"
              className="rounded-lg"
            >
              Đổi sản phẩm
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}