import CustomBreadcrumb from "@/components/layout-components/CustomBreadcrumb";
import { columns } from "@/components/admin/user/columns";
import ListUser from "@/components/admin/user/ListUser";

export default async function User() {
  return (
    <div className="my-6 px-4">
      <CustomBreadcrumb prop="User" />
      <h2 className="text-2xl my-5">List of User</h2>
      <ListUser columns={columns} />
    </div>
  );
}
