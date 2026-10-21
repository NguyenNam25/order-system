
"use client";

import CustomBreadcrumb from "@/components//layout-components/CustomBreadcrumb";
import ListOrderWS from "@/components/admin/order/ListOrderWithStatus";

export default function Page() {
  return (
    <div className="min-h-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <CustomBreadcrumb prop="Orders" />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Danh sách đơn hàng đã xác nhận
          </h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi các đơn hàng đã xác nhận và đang được vận chuyển.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-400">
          <span className="size-2 rounded-full bg-blue-500" />
          Đã xác nhận
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <ListOrderWS
          status={["CONFIRMED", "SHIPPING"]}
        />
      </div>
    </div>
  );
}
