import categoryApi from "@/api/Routes/categoryApi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductForm } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { Control, Controller } from "react-hook-form";

export default function CategorySelect({control} : {control: Control<ProductForm>}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAllCategories,
  });

  const categorySelectItem = (data ?? []).map((category) => ({
    label: category.name,
    value: String(category.id),
  }));
  return (
    <Controller
      name="categoryId"
      control={control}
      render={({ field }) => {
        const selectedLabel = categorySelectItem.find(
          (item) => item.value === String(field.value),
        )?.label;

        return (
          <Select
            value={field.value != null ? String(field.value) : ""}
            onValueChange={(value) => field.onChange(Number(value))}
          >
            <SelectTrigger>
              <SelectValue>{selectedLabel ?? "Select Category"}</SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {categorySelectItem.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      }}
    />
  );
}
