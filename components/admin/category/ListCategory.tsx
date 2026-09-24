"use client";

import categoryApi from "@/api/routes/categoryApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTableFeatures, features } from "@/interfaces/data-table-features";
import { Category } from "@/interfaces/category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  useTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/layout-components/TablePagination";
import AddCategory from "./AddCategory";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import TableCategory from "./TableCategory";

interface DataTableProps {
  columns: ColumnDef<DataTableFeatures, Category, unknown>[];
}

export default function ListCategory({ columns }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAllCategories,
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
            placeholder="Filter Category Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <AddCategory />
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
            <TableCell
              colSpan={table.getAllColumns().length}
              className="h-24 text-center"
            >
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
