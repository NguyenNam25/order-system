"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Order } from "@/interfaces/order";

import OrderDetailHeader from "./detail/OrderDetailHeader";
import OrderProducts from "./detail/OrderProducts";
import OrderShippingInfo from "./detail/OrderShippingInfo";
import OrderNotes from "./detail/OrderNotes";
import OrderDetailActions from "./detail/OrderDetailActions";

interface OrderDetailDialogProps {
  order: Order | null;
  onClose: () => void;
  onCancel: () => void;
  onReturn: () => void;
  onCompleted: () => void;
}

export default function OrderDetail({
  order,
  onClose,
  onCancel,
  onReturn,
  onCompleted,
}: OrderDetailDialogProps) {
  return (
    <Dialog
      open={order !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="
          max-h-[90vh] w-[calc(100%-24px)]
          max-w-2xl!
          gap-0 overflow-y-auto
          border border-white/10
          bg-[#101013] p-0 text-zinc-100
          sm:rounded-2xl
          [&>button:last-child]:hidden
          order-detail-scroll
        "
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng chi tiết đơn hàng"
          className="
            absolute right-4 top-4 z-50
            flex size-9 items-center justify-center
            rounded-xl border border-white/10
            bg-white/4 text-zinc-400
            transition-all duration-200
            hover:border-[#FF0033]/40
            hover:bg-[#FF0033]/15
            hover:text-[#FF4D6D]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#FF0033]/50
          "
        >
          <X className="size-4" />
        </button>

        {order && (
          <>
            <OrderDetailHeader order={order} />

            <div className="space-y-6 px-5 py-5 sm:px-6">
              <OrderProducts order={order} />

              <OrderShippingInfo order={order} />

              <OrderNotes order={order} />

              <OrderDetailActions
                status={order.status}
                onCancel={onCancel}
                onReturn={onReturn}
                onCompleted={onCompleted}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
