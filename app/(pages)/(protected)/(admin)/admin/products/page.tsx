import CustomBreadcrumb from "@/components/layout-components/CustomBreadcrumb";
import { columns } from "@/components/admin/product/columns";
import ListProduct from "@/components/admin/product/ListProduct";

export default function Product() {
  return (
    <div className="space-y-5 px-4 py-6 sm:px-6">
      <CustomBreadcrumb prop="Product" />

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Danh sách sản phẩm
        </h2>
        <p className="text-sm text-muted-foreground">
          Quản lý thông tin, giá bán và số lượng sản phẩm trong hệ thống.
        </p>
      </div>

      <ListProduct columns={columns} />
    </div>
  );
}