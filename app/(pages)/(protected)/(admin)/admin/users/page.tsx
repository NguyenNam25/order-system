import CustomBreadcrumb from "@/components/layout-components/CustomBreadcrumb";
import { columns } from "@/components/admin/user/columns";
import ListUser from "@/components/admin/user/ListUser";

export default async function User() {
  return (
    <div className="space-y-5 px-4 py-6 sm:px-6">
      <CustomBreadcrumb prop="User" />

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Danh sách người dùng
        </h2>
        <p className="text-sm text-muted-foreground">
          Quản lý thông tin và tài khoản người dùng trong hệ thống.
        </p>
      </div>

      <ListUser columns={columns} />
    </div>
  );
}