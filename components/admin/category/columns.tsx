"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/types/data-table-features";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import CategoryActions from "./CategoryActions";
import { Category } from "@/types/category";

const columnHelper = createColumnHelper<DataTableFeatures, Category>();

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
      const id = parseInt(row.getValue("id"))

      return <div className="text-left ml-2">{id}</div>
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
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <CategoryActions category={category}/>
      );
    },
  }),
]);
