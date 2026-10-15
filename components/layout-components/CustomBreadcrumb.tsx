import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function CustomBreadcrumb({ prop }: { prop: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-wrap gap-2 text-sm">
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Link href="/" />}
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="text-muted-foreground/50" />

        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium text-foreground">
            {prop}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
