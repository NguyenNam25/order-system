import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { ProductForm } from "@/types/product";
import { Control, FieldErrors, UseFormRegister, UseFormReset } from "react-hook-form";
import CategorySelect from "./CategorySelect";

type FormProp = {
  register: UseFormRegister<ProductForm>;
  errors: FieldErrors<ProductForm>;
  reset: UseFormReset<ProductForm>;
  control: Control<ProductForm>
};

export default function ProductField({register, errors, reset, control}: FormProp) {
  return (
    <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Product Name</FieldLabel>
              <Input {...register("name")} id="name" type="text" required />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="price">Price</FieldLabel>
              <Input
                {...register("price", { valueAsNumber: true })}
                id="price"
                type="number"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="categoryId">Category</FieldLabel>
              <CategorySelect control={control} />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...register("description")}
                id="description"
                placeholder="Enter Description"
                className="h-32 max-h-32 overflow-y-auto"
              />
            </Field>
            <div className="flex justify-end">
              <Button type="button" onClick={() => reset()}>
                Reset
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </FieldGroup>
  )
}
