import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductDisplay } from "@/interfaces/product";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Package, Tag, Hash, Boxes, FileText } from "lucide-react";

export default function ProductDetails({
  data,
  open,
  onOpenChange,
}: {
  data: ProductDisplay;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl! gap-6 overflow-y-auto rounded-xl border bg-background p-6 shadow-xl">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Chi tiết sản phẩm
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 text-muted-foreground">
            Xem thông tin và hình ảnh chi tiết của sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Hình ảnh sản phẩm</h3>
            <Badge variant="secondary" className="rounded-md font-normal">
              {data.images?.length ?? 0} ảnh
            </Badge>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <Carousel className="mx-auto w-full">
              <CarouselContent className="-ml-3">
                {data.images?.map((image) => (
                  <CarouselItem
                    key={image.id}
                    className="basis-1/2 pl-3 sm:basis-1/3"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background">
                      <Image
                        src={image.imageUrl}
                        alt={data.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 border-border bg-background shadow-sm sm:-left-4" />
              <CarouselNext className="-right-2 border-border bg-background shadow-sm sm:-right-4" />
            </Carousel>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
                  <Package className="size-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Tên sản phẩm
                  </p>
                  <p className="break-words text-base font-semibold">
                    {data.name}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="shrink-0 rounded-md border-border font-normal"
              >
                ID: {data.id}
              </Badge>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
                  <Tag className="size-4" />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-muted-foreground">Danh mục</p>
                  <p className="break-words text-sm font-medium">
                    {data.category.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
                  <Boxes className="size-4" />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Số lượng tồn kho
                  </p>
                  <p className="text-sm font-medium tabular-nums">
                    {data.quantity}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="mb-1 text-sm text-muted-foreground">Giá bán</p>
            <p className="text-2xl font-semibold tracking-tight text-primary tabular-nums">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(data.price)}
            </p>
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Mô tả sản phẩm</h3>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
              {data.description || "Chưa có mô tả cho sản phẩm này."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
