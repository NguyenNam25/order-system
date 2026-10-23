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
import { XIcon, RotateCcw, Upload } from "lucide-react";
import CategorySelect from "./CategorySelect";
import Image from "next/image";

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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    onImagesChange([...images, ...files]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <FieldGroup className="gap-5">
      <Field className="gap-2">
        <FieldLabel htmlFor="images" className="text-sm font-medium">
          Hình ảnh sản phẩm
        </FieldLabel>

        <div className="rounded-xl border border-border bg-muted/20 p-4 transition-colors hover:border-muted-foreground/50">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Upload className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Tải ảnh sản phẩm</p>
              <p className="text-xs leading-5 text-muted-foreground">
                Chọn một hoặc nhiều hình ảnh từ thiết bị của bạn.
              </p>
            </div>
          </div>

          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="h-auto cursor-pointer rounded-lg border-input bg-background px-3 py-2 text-sm shadow-none transition-colors hover:border-muted-foreground/50 file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80"
          />
        </div>

        {images.length > 0 && (
          <AttachmentGroup className="grid w-full min-w-0 max-w-full grid-cols-2 gap-3 overflow-x-hidden sm:grid-cols-3">
            {images.map((file, index) => (
              <Attachment
                key={`${file.name}-${index}`}
                orientation="vertical"
                className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-background"
              >
                <AttachmentMedia
                  variant="image"
                  className="aspect-square w-full overflow-hidden bg-muted/30"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={300}
                    height={300}
                    unoptimized
                    className="size-full object-cover"
                  />
                </AttachmentMedia>

                <AttachmentContent className="min-w-0 gap-1 p-3">
                  <AttachmentTitle className="truncate text-xs font-medium">
                    {file.name}
                  </AttachmentTitle>

                  <AttachmentDescription className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </AttachmentDescription>
                </AttachmentContent>

                <AttachmentAction
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border border-border bg-background/95 text-muted-foreground shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <XIcon className="size-4" />
                </AttachmentAction>
              </Attachment>
            ))}
          </AttachmentGroup>
        )}
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="name" className="text-sm font-medium">
          Tên sản phẩm
        </FieldLabel>
        <Input
          {...register("name")}
          id="name"
          type="text"
          required
          placeholder="Nhập tên sản phẩm"
          className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="price" className="text-sm font-medium">
          Giá sản phẩm (VNĐ)
        </FieldLabel>
        <Input
          {...register("price", { valueAsNumber: true })}
          id="price"
          type="number"
          placeholder="Nhập giá sản phẩm"
          className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
        />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="categoryId" className="text-sm font-medium">
          Danh mục
        </FieldLabel>
        <CategorySelect control={control} />
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="quantity" className="text-sm font-medium">
          Số lượng tồn kho
        </FieldLabel>
        <Input
          {...register("quantity", {
            valueAsNumber: true,
          })}
          id="quantity"
          type="number"
          min={0}
          placeholder="Nhập số lượng"
          className="h-10 rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
        />
        {errors.quantity && (
          <p className="text-sm text-destructive">{errors.quantity.message}</p>
        )}
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="description" className="text-sm font-medium">
          Mô tả sản phẩm
        </FieldLabel>
        <Textarea
          {...register("description")}
          id="description"
          placeholder="Nhập mô tả chi tiết về sản phẩm..."
          className="min-h-32 max-h-32 resize-none overflow-y-auto rounded-lg border-input bg-background shadow-none transition-colors hover:border-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          className="h-10 gap-2 rounded-lg border-input px-4"
        >
          <RotateCcw className="size-4" />
          Đặt lại
        </Button>
        <Button type="submit" className="h-10 rounded-lg px-5 shadow-sm">
          Thêm sản phẩm
        </Button>
      </div>
    </FieldGroup>
  );
}
