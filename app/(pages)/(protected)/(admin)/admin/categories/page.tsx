import CustomBreadcrumb from "@/components/layout-components/CustomBreadcrumb";
import { columns } from "@/components/admin/category/columns";
import ListCategory from "@/components/admin/category/ListCategory";

export default function Category() {
  return (
    <div className="space-y-5 px-4 py-6 sm:px-6">
      <CustomBreadcrumb prop="Category" />

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Danh sách danh mục
        </h2>
        <p className="text-sm text-muted-foreground">
          Quản lý danh mục sản phẩm trong hệ thống.
        </p>
      </div>

      <ListCategory columns={columns} />
    </div>
  );
}