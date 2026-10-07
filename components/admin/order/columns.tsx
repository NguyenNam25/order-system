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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const orderCode = String(row.getValue("orderCode"));

        return <div className="text-left ml-2">{orderCode}</div>;
      },
    }),
    columnHelper.accessor("user.fullname", {
      id: "user.fullname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="ml-2 text-left">{row.original.user.fullname}</div>
        );
      },
    }),
    columnHelper.accessor("items", {
      id: "productName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const items = row.original.items;

        return (
          <div className="ml-2 text-left">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <Image
                  src={item.product.images[0].imageUrl}
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
                <span>{item.product.name}</span>
                <span>x{item.quantity}</span>
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
              <div className="text-left">{row.original.role}</div>
            ),
          }),
        ]
      : []),

    columnHelper.accessor("total", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="ml-2 text-left">{formatVND(row.original.total)}</div>
        );
      },
    }),
    columnHelper.accessor("items.quantity", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số lượng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const quantity = row.original.items.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        return (
          <div className="pr-2 text-left flex w-full items-center justify-center">
            {quantity}
          </div>
        );
      },
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
