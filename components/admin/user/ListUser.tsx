"use client";

import { useQuery } from "@tanstack/react-query";
import userApi from "@/api/Routes/userApi";
import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  useTable,
} from "@tanstack/react-table";
import { DataTableFeatures } from "@/types/data-table-features";
import { features } from "@/types/data-table-features";
import { User } from "@/types/user";
import { DataTablePagination } from "../Components/TablePagination";
import { Input } from "../ui/input";
import { useState } from "react";
import AddUser from "./AddUser";
import ListLayout from "../ui/ListLayout";
import TableUser from "./TableUser";

interface DataTableProps {
  columns: ColumnDef<DataTableFeatures, User, unknown>[];
}

export default function ListUser({ columns }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: userApi.getAllUsers,
  });

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      }
    }
  });

  return (
    <div>
      <ListLayout>
        <div className="flex items-center pb-4 pt-2 justify-between">
          <Input
            placeholder="Filter Full Name..."
            value={
              (table.getColumn("fullname")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("fullname")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <AddUser/>
        </div>
        <TableUser table={table}/>
      </ListLayout>
      <DataTablePagination table={table} />
    </div>
  );
}
