
"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/interfaces/data-table-features";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import CategoryActions from "./CategoryActions";
import { Category } from "@/interfaces/category";

const columnHelper = createColumnHelper<DataTableFeatures, Category>();

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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          Tên danh mục
          <ArrowUpDown className="ml-2 h-4 w-4" />
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

  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      return <CategoryActions category={category} />;
    },
  }),
]);
