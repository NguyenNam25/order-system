"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/interfaces/data-table-features";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Category } from "@/interfaces/category";
import { Order } from "@/interfaces/order";
import { formatDate, formatVND } from "@/lib/format";
import OrderActions from "./OrderActions";
import Image from "next/image";
import orderApi from "@/api/routes/orderApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import FastActions from "./FastActions";

const columnHelper = createColumnHelper<DataTableFeatures, Order>();

export const getColumns = (showCancelRole = false) =>
  columnHelper.columns([
    columnHelper.accessor("orderCode", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-9 gap-2 rounded-lg px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Mã đơn hàng
          <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-2 whitespace-nowrap text-sm font-semibold text-foreground">
          {String(row.getValue("orderCode"))}
        </div>
      ),
    }),

    columnHelper.accessor("user.fullname", {
      id: "user.fullname",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-9 gap-2 rounded-lg px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Người đặt
          <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-2 min-w-32 text-sm font-medium">
          {row.original.user.fullname}
        </div>
      ),
    }),

    columnHelper.accessor("items", {
      id: "productName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-9 gap-2 rounded-lg px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Sản phẩm
          <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const items = row.original.items;

        return (
          <div className="ml-2 min-w-52 space-y-3 py-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30">
                  <Image
                    src={item.product.images[0].imageUrl}
                    alt={item.product.name}
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-5">
                    {item.product.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Số lượng: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      },
    }),

    ...(showCancelRole
      ? [
          columnHelper.accessor("role", {
            id: "role",
            header: "Người hủy",
            cell: ({ row }) => (
              <div className="text-sm font-medium">
                {row.original.role}
              </div>
            ),
          }),
        ]
      : []),

    columnHelper.accessor("total", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-9 gap-2 rounded-lg px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Tổng tiền
          <ArrowUpDown className="size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-2 whitespace-nowrap text-sm font-semibold tabular-nums">
          {formatVND(row.original.total)}
        </div>
      ),
    }),

    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return <OrderActions order={order} />;
      },
    }),

    columnHelper.display({
      id: "fastActions",
      cell: ({ row }) => {
        const order = row.original;
        return <FastActions order={order} />;
      },
    }),
  ]);
