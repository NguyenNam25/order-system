import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCategories from "@/hooks/categories/queries/useCategories";
import { ProductForm } from "@/interfaces/product";
import { Control, Controller } from "react-hook-form";

export default function CategorySelect({
  control,
}: {
  control: Control<ProductForm>;
}) {
  const { data } = useCategories();

  console.log(data);

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
            <SelectTrigger className="h-10 w-full rounded-lg border-input bg-background px-3 text-sm shadow-none transition-colors hover:border-muted-foreground/50 focus:border-ring focus:ring-2 focus:ring-ring/20">
              <SelectValue>{selectedLabel ?? "Chọn danh mục"}</SelectValue>
            </SelectTrigger>

            <SelectContent className="rounded-lg border border-border bg-popover p-1 shadow-lg">
              <SelectGroup>
                {categorySelectItem.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="cursor-pointer rounded-md text-sm"
                  >
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
