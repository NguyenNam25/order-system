import CustomBreadcrumb from "@/components/Components/CustomBreadcrumb";
import { columns } from "@/components/product/columns";
import ListProduct from "@/components/product/ListProduct";

export default function Product() {
  return (
    <div className="my-6 px-4">
      <CustomBreadcrumb prop="Product" />
      <h2 className="text-2xl my-5">List of Product</h2>
      <ListProduct columns={columns} />
    </div>
  );
}
