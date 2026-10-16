import ProductDetail from "@/components/product/ProductDetail";

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
