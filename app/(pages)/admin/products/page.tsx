import CustomBreadcrumb from "@/components//layout-components/CustomBreadcrumb";
import { columns } from "@/components/admin/product/columns";
import ListProduct from "@/components/admin/product/ListProduct";

export default function Product() {
  return (
    <div className="my-6 px-4">
      <CustomBreadcrumb prop="Product" />
      <h2 className="text-2xl my-5">List of Product</h2>
      <ListProduct columns={columns} />
    </div>
  );
}
