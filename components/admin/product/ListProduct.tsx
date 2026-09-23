"use client";

import { useQuery } from "@tanstack/react-query";
import productApi from "@/api/Routes/productApi";
import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  useTable,
} from "@tanstack/react-table";
import { ProductDisplay } from "@/types/product";
import { DataTableFeatures, features } from "@/types/data-table-features";
import { Input } from "../ui/input";
import { DataTablePagination } from "../Components/TablePagination";
import ListLayout from "../ui/ListLayout";
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
      <ListLayout>
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
        <TableProduct table={table}/>
      </ListLayout>
      <DataTablePagination table={table} />
    </div>
  )
}
