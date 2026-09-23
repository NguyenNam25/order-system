"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/types/data-table-features";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Product, ProductDisplay } from "@/types/product";
import ProductActions from "./ProductActions";

const columnHelper = createColumnHelper<DataTableFeatures, ProductDisplay>();

export const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = parseInt(row.getValue("id"));

      return <div className="text-left ml-2">{id}</div>;
    },
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = String(row.getValue("name") ?? "");

      return <div className="text-left ml-2">{name}</div>;
    },
  }),
  columnHelper.accessor("category.name", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const categoryName = row.original.category.name;
      return <div className="text-left ml-2">{categoryName}</div>;
    },
  }),
  columnHelper.accessor("price", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseInt(row.getValue("price"));

      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
      return <div className="text-left ml-2">{formatted}</div>;
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
