"use client";

import { useQuery } from "@tanstack/react-query";
import productApi from "@/api/routes/productApi";
import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
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
import { ProductDisplay } from "@/interfaces/product";
import { DataTableFeatures, features } from "@/interfaces/data-table-features";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/layout-components/TablePagination";
import AddProduct from "./AddProduct";
import TableProduct from "./TableProduct";

interface DataTableProps {
  columns: ColumnDef<DataTableFeatures, ProductDisplay, unknown>[];
}

export default function ListProduct({ columns }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAllProducts,
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

  console.log(data)

  return (
    <div>

        <div className="flex items-center pb-4 pt-2 justify-between">
          <Input
            placeholder="Filter Product Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <AddProduct/>
        </div>
        <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
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
  )
}
