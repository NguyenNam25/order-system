"use client";

import { useQuery } from "@tanstack/react-query";
import userApi from "@/api/routes/userApi";
import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  useTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { DataTableFeatures } from "@/interfaces/data-table-features";
import { features } from "@/interfaces/data-table-features";
import { User } from "@/interfaces/user";
import { DataTablePagination } from "@/components/layout-components/TablePagination";
import { Input } from "@/components/ui/input"; 
import { useState } from "react";
import AddUser from "./AddUser";

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
        <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

      <DataTablePagination table={table} />
    </div>
  );
}
