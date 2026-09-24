import CustomBreadcrumb from "@/components//layout-components/CustomBreadcrumb";
import { columns } from "@/components/admin/order/columns";
import ListOrder from "@/components/admin/order/ListOrder";


export default function Orders() {
  return (
    <div className="my-6 px-4">
      <CustomBreadcrumb prop="Orders" />
      <h2 className="text-2xl my-5">List of orders</h2>
      <ListOrder columns={columns} />
    </div>
  );
}
