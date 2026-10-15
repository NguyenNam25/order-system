"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/interfaces/data-table-features";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { User } from "@/interfaces/user";
import UserActions from "./UserActions";

const columnHelper = createColumnHelper<DataTableFeatures, User>();

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

  columnHelper.accessor("fullname", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="h-9 px-2 font-semibold text-muted-foreground hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Họ và tên
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = String(row.getValue("fullname") ?? "");

      const formatted = name.charAt(0).toUpperCase() + name.slice(1);

      return (
        <div className="ml-2 font-medium text-foreground">
          {name}
        </div>
      );
    },
  }),

  columnHelper.accessor("email", {
    header: () => (
      <div className="px-2 font-semibold text-muted-foreground">
        Email
      </div>
    ),
    cell: ({ row }) => {
      const email = String(row.getValue("email") ?? "");

      return (
        <div className="px-2 text-sm text-muted-foreground">
          {email}
        </div>
      );
    },
  }),

  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return <UserActions user={user} />;
    },
  }),
]);
