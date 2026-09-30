"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import AppSideMenuItem, { SideMenuItemProps } from "./AppSideMenuItem";
import { useAuth } from "../auth/AuthContext";
import { LogOut, UserIcon } from "lucide-react";

const SideMenuItem = [
  { status: "PENDING", url: "/admin/orders/pending", title: "Pending Orders" },
  {
    status: "CONFIRMED",
    url: "/admin/orders/confirmed",
    title: "Confirmed Orders",
  },
  {
    status: "COMPLETED",
    url: "/admin/orders/completed",
    title: "Completed Orders",
  },
  {
    status: "CANCELLED",
    url: "/admin/orders/cancelled",
    title: "Cancelled Orders",
  },
  {
    status: "RETURN_REQUESTED",
    url: "/admin/orders/return_requested",
    title: "Return Requested",
  },
  {
    status: "RETURNED",
    url: "/admin/orders/returned",
    title: "Returned Orders",
  },
] satisfies SideMenuItemProps[];

export function AppSidebar() {
  const { currentUser, isLoading, logout } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:hidden">
        <Link href={"/admin"}>
          <h1>Shop Management</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Link href={"/admin/users"}>
                    <h1>User</h1>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Link href={"/admin/products"}>
                    <h1>Product</h1>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Link href={"/admin/categories"}>
                    <h1>Category</h1>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Đơn hàng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <h1>Orders</h1>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {SideMenuItem.map((item) => (
                    <AppSideMenuItem
                      key={item.status}
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
      <SidebarFooter>
        {currentUser ? (
          <div onClick={logout} className="hover:cursor-pointer hover:bg-gray-400 rounded-lg p-2 flex justify-between">
            <span>{currentUser.fullname}</span>
            <LogOut/>
          </div>
        ) : (
          <Link href={"/login"}>
            <div className="flex gap-1 h-full items-center">
              <UserIcon />
              <h2  className="group-data-[collapsible=icon]:hidden">Login</h2>
            </div>
          </Link>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
