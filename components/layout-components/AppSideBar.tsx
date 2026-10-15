
"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  ShoppingCart,
  LogOut,
  UserRound,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";

import AppSideMenuItem, {
  SideMenuItemProps,
} from "./AppSideMenuItem";
import { useAuth } from "../auth/AuthContext";

const orderMenuItems = [
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

const managementMenuItems = [
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

export function AppSidebar() {
  const router = useRouter();
  const { currentUser, isLoading, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Tên hệ thống */}
      <SidebarHeader className="border-b px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Quản lý cửa hàng"
              className="h-10"
              onClick={() => router.push("/admin")}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="font-semibold">Quản lý cửa hàng</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-1">
        {/* Quản lý */}
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {managementMenuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => router.push(item.url)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Đơn hàng */}
        <SidebarGroup>
          <SidebarGroupLabel>Đơn hàng</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Quản lý đơn hàng"
                  className="font-medium"
                  onClick={() => router.push("/admin/orders/pending")}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Quản lý đơn hàng</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>

                <SidebarMenuSub>
                  {orderMenuItems.map((item) => (
                    <AppSideMenuItem
                      key={item.title}
                      status={item.status}
                      url={item.url}
                      title={item.title}
                    />
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Tài khoản */}
      <SidebarFooter className="border-t p-3">
        {isLoading ? (
          <div className="px-2 py-2 text-sm text-muted-foreground">
            Đang tải tài khoản...
          </div>
        ) : currentUser ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={currentUser.fullname}
                className="h-auto py-2"
              >
                <UserRound className="h-4 w-4 shrink-0" />

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {currentUser.fullname}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Quản trị viên
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Đăng xuất"
                  title="Đăng xuất"
                  onClick={(event) => {
                    event.stopPropagation();
                    logout();
                  }}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Đăng nhập"
                onClick={() => router.push("/login")}
              >
                <UserRound className="h-4 w-4" />
                <span>Đăng nhập</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
