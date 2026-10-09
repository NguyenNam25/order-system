"use client"

import CustomBreadcrumb from "@/components//layout-components/CustomBreadcrumb";
import { getColumns } from "@/components/admin/order/columns";

import ListOrderWS from "@/components/admin/order/ListOrderWithStatus";

export default function page() {
  return (
    <div className="my-6 px-4">
      <CustomBreadcrumb prop="Orders" />
      <h2 className="text-2xl my-5">List of Completed orders</h2>
      <ListOrderWS columns={getColumns(false)} status={["COMPLETED", "RETURN_REJECTED"]}/>
    </div>
  );
}
