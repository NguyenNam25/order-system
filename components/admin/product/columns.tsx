"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/interfaces/data-table-features";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ProductDisplay } from "@/interfaces/product";
import ProductActions from "./ProductActions";

const columnHelper = createColumnHelper<DataTableFeatures, ProductDisplay>();

export const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-9 px-2 font-semibold text-muted-foreground hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = parseInt(row.getValue("id"));

      return (
        <div className="ml-2 font-medium tabular-nums text-muted-foreground">
          {id}
        </div>
      );
    },
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-9 px-2 font-semibold text-muted-foreground hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên sản phẩm
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = String(row.getValue("name") ?? "");

      return (
        <div className="ml-2 font-medium text-foreground">
          {name}
        </div>
      );
    },
  }),
  columnHelper.accessor("category.name", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-9 px-2 font-semibold text-muted-foreground hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Danh mục
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const categoryName = row.original.category.name;
      return (
        <div className="ml-2 text-sm text-muted-foreground">
          {categoryName}
        </div>
      );
    },
  }),
  columnHelper.accessor("price", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-9 px-2 font-semibold text-muted-foreground hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá bán
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseInt(row.getValue("price"));

      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);

      return (
        <div className="ml-2 whitespace-nowrap font-medium tabular-nums text-foreground">
          {formatted}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return <ProductActions product={product} />;
    },
  }),
]);