import { AlertCircle, RotateCcw, FileText } from "lucide-react";
import type { Order } from "@/interfaces/order";
import { Separator } from "@/components/ui/separator";

interface Props {
  order: Order;
}

export default function OrderNotes({ order }: Props) {
  const notes = [
    {
      key: "cancel",
      title: "Lý do hủy đơn",
      content: order.cancelNote,
      icon: AlertCircle,
      color: "red",
    },
    {
      key: "return",
      title: "Lý do hoàn hàng",
      content: order.returnNote,
      icon: RotateCcw,
      color: "orange",
    },
    {
      key: "reject",
      title: "Lý do từ chối hoàn hàng",
      content: order.returnRejectNote,
      icon: FileText,
      color: "red",
    },
  ].filter((note) => note.content?.trim());

  if (notes.length === 0) return null;

  return (
    <>
      <section className="space-y-3">
        <h3 className="font-semibold text-white">Ghi chú đơn hàng</h3>

        {notes.map((note) => {
          const Icon = note.icon;
          const isReturn = note.color === "orange";

          return (
            <div
              key={note.key}
              className={
                isReturn
                  ? "rounded-lg border border-orange-500/15 bg-orange-500/6 p-3"
                  : "rounded-lg border border-red-500/15 bg-red-500/6 p-3"
              }
            >
              <p
                className={
                  isReturn
                    ? "mb-1 flex items-center gap-2 text-xs font-semibold text-orange-400"
                    : "mb-1 flex items-center gap-2 text-xs font-semibold text-red-400"
                }
              >
                <Icon className="size-3.5" />
                {note.title}
              </p>

              <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-zinc-300">
                {note.content}
              </p>
            </div>
          );
        })}
      </section>

      <Separator className="bg-white/8" />
    </>
  );
}
