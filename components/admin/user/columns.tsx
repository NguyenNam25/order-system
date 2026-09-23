"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/types/data-table-features";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { User } from "@/types/user";
import UserActions from "./UserActions";

const columnHelper = createColumnHelper<DataTableFeatures, User>();

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
  columnHelper.accessor("fullname", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = String(row.getValue("fullname") ?? "");

      const formatted = name.charAt(0).toUpperCase() + name.slice(1);

      return <div className="text-left ml-2">{name}</div>;
    },
  }),
  columnHelper.accessor("email", {
    header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => {
      const email = String(row.getValue("email") ?? "");

      return <div className="text-left">{email}</div>;
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <UserActions user={user}/>
      );
    },
  }),
]);
