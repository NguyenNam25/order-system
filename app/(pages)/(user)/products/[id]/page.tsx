
import productApi from "@/api/routes/productApi";
import ProductDetail from "@/components/product/ProductDetail";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <div>
      <ProductDetail id={id} />
    </div>
  );
}
