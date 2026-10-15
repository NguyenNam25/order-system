"use client";

import CustomBreadcrumb from "@/components//layout-components/CustomBreadcrumb";
import { getColumns } from "@/components/admin/order/columns";
import ListOrderWS from "@/components/admin/order/ListOrderWithStatus";

export default function Page() {
  return (
    <div className="min-h-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <CustomBreadcrumb prop="Orders" />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Danh sách đơn hàng đã hoàn tất
          </h2>
          <p className="text-sm text-muted-foreground">
            Xem các đơn hàng đã giao thành công hoặc bị từ chối hoàn hàng.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          <span className="size-2 rounded-full bg-emerald-500" />
          Đã hoàn tất
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <ListOrderWS
          columns={getColumns(false)}
          status={["COMPLETED", "RETURN_REJECTED"]}
        />
      </div>
    </div>
  );
}
