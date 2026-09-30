
import CustomBreadcrumb from "@/components/layout-components/CustomBreadcrumb";
import { columns } from "@/components/admin/category/columns";
import ListCategory from "@/components/admin/category/ListCategory";

export default function Category() {
  return (
    <div className="my-6 px-4">
      <CustomBreadcrumb prop="Category" />
      <h2 className="text-2xl my-5">List of Category</h2>
      <ListCategory columns={columns} />
    </div>
  );
}
