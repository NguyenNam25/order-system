import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import type { CategoryForm } from "@/interfaces/category";

type FormProp = {
  register: UseFormRegister<CategoryForm>;
  errors: FieldErrors<CategoryForm>;
};

export default function CategoryField({
  register,
  errors,
}: FormProp) {
  return (
    <FieldGroup className="gap-5">
      <Field className="gap-2">
        <FieldLabel
          htmlFor="name"
          className="text-sm font-medium"
        >
          Tên danh mục
        </FieldLabel>

        <Input
          {...register("name")}
          id="name"
          type="text"
          placeholder="Nhập tên danh mục"
          aria-invalid={!!errors.name}
          className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
        />

        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </Field>
    </FieldGroup>
  );
}
