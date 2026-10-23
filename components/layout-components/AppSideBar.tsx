"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
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
import AppSideMenuItem from "./AppSideMenuItem";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui/button";
import {
  orderMenuItems,
  managementMenuItems,
} from "@/constants/side-menu-items";

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
              <div className="flex items-center gap-1">
                {/* Thông tin tài khoản */}
                <SidebarMenuButton
                  tooltip={currentUser.fullname}
                  className="h-auto min-w-0 flex-1 py-2"
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
                </SidebarMenuButton>

                {/* Nút đăng xuất độc lập */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Đăng xuất"
                  title="Đăng xuất"
                  onClick={logout}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
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
