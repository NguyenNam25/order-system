import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { UseQueryResult } from "@tanstack/react-query";
import { Product } from "@/interfaces/product";

export default function ProductErrorState({refetch}: {refetch: UseQueryResult<Product[], Error>["refetch"]}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111114] px-4 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-[#FF0033]">
        <ShoppingCart className="h-6 w-6" />
      </div>

      <h3 className="mt-4 font-semibold text-white">Không thể tải sản phẩm</h3>
      <p className="mt-2 text-sm text-zinc-400">
        Đã xảy ra lỗi khi kết nối. Vui lòng thử lại.
      </p>

      <Button
        variant="outline"
        className="mt-5 rounded-xl border-zinc-700 bg-zinc-900 text-white hover:border-[#FF0033] hover:bg-red-500/10 hover:text-white"
        onClick={() => refetch()}
      >
        Thử lại
      </Button>
    </div>
  );
}
