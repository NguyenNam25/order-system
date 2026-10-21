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
            Danh sách yêu cầu hoàn hàng
          </h2>
          <p className="text-sm text-muted-foreground">
            Kiểm tra và xử lý các yêu cầu hoàn hàng từ khách hàng.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-400">
          <span className="size-2 rounded-full bg-amber-500" />
          Chờ xử lý
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <ListOrderWS status={["RETURN_REQUESTED"]} />
      </div>
    </div>
  );
}
