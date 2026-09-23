import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FieldErrors,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import { CategoryForm } from "@/types/category";

type FormProp = {
  register: UseFormRegister<CategoryForm>;
  errors: FieldErrors<CategoryForm>;
  reset: UseFormReset<CategoryForm>;
};

export default function CategoryField({
  register,
  errors,
  reset,
}: FormProp) {
  return (
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Category Name</FieldLabel>
          <Input
            {...register("name")}
            id="name"
            type="text"
            placeholder="name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </Field>
        <div className="flex justify-end">
          <Button type="button" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </FieldGroup>
  );
}