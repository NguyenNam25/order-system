"use client";


import categoryApi from "@/api/Routes/categoryApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTableFeatures, features } from "@/types/data-table-features";
import { Category } from "@/types/category";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  useTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "../ui/input";
import { DataTablePagination } from "../Components/TablePagination";
import ListLayout from "../ui/ListLayout";
import AddCategory from "./AddCategory";
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
      <ListLayout>
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
        <TableCategory table={table}/>
      </ListLayout>
      <DataTablePagination table={table} />
    </div>
  );
}
