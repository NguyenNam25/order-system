"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

type AlertDialogDelete = {
  id: number;
  type: "category" | "product" | "user";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: number) => void;
};

export default function AlertDialogDelete({
  id,
  type,
  open,
  onOpenChange,
  onDelete,
}: AlertDialogDelete) {
  const handleDelete = () => {
    onDelete(id);
    onOpenChange(false);
  };

  const itemName =
    type === "category"
      ? "danh mục"
      : type === "product"
        ? "sản phẩm"
        : "người dùng";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl border p-0 shadow-xl">
        <AlertDialogHeader className="p-6 pb-5">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>

          <AlertDialogTitle className="text-xl font-semibold tracking-tight">
            Xác nhận xóa {itemName}
          </AlertDialogTitle>

          <AlertDialogDescription className="pt-1 text-sm leading-6 text-muted-foreground">
            Bạn có chắc chắn muốn xóa {itemName} này không?
            <span className="mt-2 block">
              Hành động này có thể không hoàn tác được.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mx-6 rounded-lg border border-destructive/15 bg-destructive/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <Trash2 className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-sm text-muted-foreground">
              Dữ liệu liên quan có thể bị ảnh hưởng sau khi xóa.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="mt-6 flex-row justify-end gap-2 border-t bg-muted/30 p-4 sm:space-x-0">
          <AlertDialogCancel className="mt-0 h-10 rounded-lg px-4">
            Hủy
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            className="h-10 gap-2 rounded-lg bg-destructive px-4 text-destructive-foreground shadow-sm transition-colors hover:bg-destructive/90"
          >
            <Trash2 className="size-4" />
            Xóa {itemName}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}