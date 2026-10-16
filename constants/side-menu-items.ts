import { SideMenuItemProps } from "@/components/layout-components/AppSideMenuItem";
import { Package, Tags, Users } from "lucide-react";

export const orderMenuItems = [
  {
    status: "PENDING",
    url: "/admin/orders/pending",
    title: "Chờ xác nhận",
  },
  {
    status: ["CONFIRMED", "SHIPPING"],
    url: "/admin/orders/confirmed",
    title: "Đang xử lý",
  },
  {
    status: ["COMPLETED", "RETURN_REJECTED"],
    url: "/admin/orders/completed",
    title: "Đã hoàn thành",
  },
  {
    status: "CANCELLED",
    url: "/admin/orders/cancelled",
    title: "Đã hủy",
  },
  {
    status: "RETURN_REQUESTED",
    url: "/admin/orders/return_requested",
    title: "Yêu cầu trả hàng",
  },
  {
    status: "RETURN_APPROVED",
    url: "/admin/orders/returned",
    title: "Đã duyệt trả hàng",
  },
] satisfies SideMenuItemProps[];

export const managementMenuItems = [
  {
    title: "Người dùng",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Sản phẩm",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Danh mục",
    url: "/admin/categories",
    icon: Tags,
  },
];