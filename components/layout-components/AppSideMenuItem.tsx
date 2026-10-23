"use client";

import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import orderApi from "@/api/routes/orderApi";
import type { Order } from "@/interfaces/order";

export interface SideMenuItemProps {
  status: Order["status"] | Order["status"][];
  url: string;
  title: string;
}

export default function AppSideMenuItem({
  status,
  url,
  title,
}: SideMenuItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const statuses = Array.isArray(status) ? status : [status];
  const isActive = pathname === url;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", statuses],
    queryFn: () => orderApi.getOrdersByStatus(statuses),
  });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={title}
        onClick={() => router.push(url)}
        className="text-muted-foreground"
      >
        <span className="truncate">{title}</span>
      </SidebarMenuButton>

      {!isLoading && !isError && (
        <SidebarMenuBadge>{data?.length ?? 0}</SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}
