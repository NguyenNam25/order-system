import CustomBreadcrumb from "@/components//layout-components/CustomBreadcrumb";
import { columns } from "@/components/admin/order/columns";
import ListOrderWS from "@/components/admin/order/ListOrderWithStatus";

export default function page() {
  return (
    <div className="my-6 px-4">
      <CustomBreadcrumb prop="Orders" />
      <h2 className="text-2xl my-5">List of Pending orders</h2>
      <ListOrderWS columns={columns} status="PENDING"/>
    </div>
  );
}
