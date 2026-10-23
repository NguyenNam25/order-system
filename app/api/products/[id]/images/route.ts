import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// POST /api/products/[id]/images
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    // 3. Kiểm tra productId
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "ID sản phẩm không hợp lệ" },
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 },
      );
    }

    // 4. Kiểm tra imageUrl
    const body = await request.json();

    if (typeof body.imageUrl !== "string" || !body.imageUrl.trim()) {
      return NextResponse.json(
        { message: "URL ảnh không hợp lệ" },
        { status: 400 },
      );
    }

    // 5. Tạo bản ghi ảnh
    const image = await prisma.productImage.create({
      data: {
        imageUrl: body.imageUrl.trim(),
        productId,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}
