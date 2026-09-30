"use client"

import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import orderApi from "@/api/routes/orderApi";
import { Order } from "@/interfaces/order";

export interface SideMenuItemProps {
  status: Order["status"];
  url: string
  title: string
}

export default function AppSideMenuItem({ status, url, title }: SideMenuItemProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", status],
    queryFn: () => orderApi.getOrdersByStatus(status),
  });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        <Link href={url}>
          <h1>{title}</h1>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuBadge>{data?.length}</SidebarMenuBadge>
    </SidebarMenuItem>
  );
}
