
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/interfaces/order";
import { AlertCircle, FileText, RotateCcw } from "lucide-react";

interface OrderNotesProps {
  order: Order;
}

export default function OrderNotes({ order }: OrderNotesProps) {
  const notes = [
    {
      key: "cancel",
      title: "Lý do hủy đơn",
      content: order.cancelNote,
      icon: AlertCircle,
      className: "text-destructive",
    },
    {
      key: "return",
      title: "Lý do yêu cầu trả hàng",
      content: order.returnNote,
      icon: RotateCcw,
      className: "text-orange-600 dark:text-orange-400",
    },
    {
      key: "reject",
      title: "Lý do từ chối trả hàng",
      content: order.returnRejectNote,
      icon: FileText,
      className: "text-destructive",
    },
  ].filter((note) => note.content?.trim());

  if (notes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">Ghi chú đơn hàng</h3>

      <div className="space-y-3">
        {notes.map((note) => {
          const Icon = note.icon;

          return (
            <Card
              key={note.key}
              className="rounded-xl border-border py-0 shadow-none"
            >
              <CardContent className="flex gap-3 p-4">
                <div className={`mt-0.5 shrink-0 ${note.className}`}>
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-medium">{note.title}</p>

                  <p className="text-sm leading-6 whitespace-pre-wrap wrap-break-word text-muted-foreground">
                    {note.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
