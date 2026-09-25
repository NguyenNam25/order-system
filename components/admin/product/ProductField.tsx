import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductForm } from "@/interfaces/product";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import {
  Attachment,
  AttachmentAction,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { XIcon } from "lucide-react";
import CategorySelect from "./CategorySelect";

type FormProp = {
  register: UseFormRegister<ProductForm>;
  errors: FieldErrors<ProductForm>;
  reset: UseFormReset<ProductForm>;
  control: Control<ProductForm>;
  images: File[];
  onImagesChange: (files: File[]) => void;
};

export default function ProductField({
  register,
  errors,
  reset,
  control,
  images,
  onImagesChange,
}: FormProp) {
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    onImagesChange([...images, ...files]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    onImagesChange(
      images.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  return (
    <FieldGroup className="">
      <Field>
        <FieldLabel htmlFor="images">
          Product Images
        </FieldLabel>

        {/* Input thật để chọn file */}
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        {/* Hiển thị các file bằng Attachment */}
        {images.length > 0 && (
          <AttachmentGroup className="w-full min-w-0 max-w-full overflow-x-auto">
            {images.map((file, index) => (
              <Attachment
                key={`${file.name}-${index}`}
                orientation="vertical"
              >
                <AttachmentMedia variant="image">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                  />
                </AttachmentMedia>

                <AttachmentContent>
                  <AttachmentTitle>
                    {file.name}
                  </AttachmentTitle>

                  <AttachmentDescription>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </AttachmentDescription>
                </AttachmentContent>

                <AttachmentAction
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeImage(index)}
                >
                  <XIcon />
                </AttachmentAction>
              </Attachment>
            ))}
          </AttachmentGroup>
        )}
      </Field>
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
        <FieldLabel htmlFor="quantity">Quantity</FieldLabel>

        <Input
          {...register("quantity", {
            valueAsNumber: true,
          })}
          id="quantity"
          type="number"
          min={0}
        />

        {errors.quantity && (
          <p className="text-red-500 text-sm">{errors.quantity.message}</p>
        )}
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
  );
}
