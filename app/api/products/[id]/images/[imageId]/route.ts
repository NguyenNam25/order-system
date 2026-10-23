import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      imageId: string;
    }>;
  },
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    // 3. Kiểm tra ID
    const { id, imageId } = await params;
    const productId = Number(id);
    const productImageId = Number(imageId);

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(productImageId) ||
      productImageId <= 0
    ) {
      return NextResponse.json(
        { message: "ID sản phẩm hoặc hình ảnh không hợp lệ" },
        { status: 400 },
      );
    }

    // 4. Tìm ảnh thuộc đúng sản phẩm
    const image = await prisma.productImage.findFirst({
      where: {
        id: productImageId,
        productId,
      },
    });

    if (!image) {
      return NextResponse.json(
        { message: "Không tìm thấy ảnh" },
        { status: 404 },
      );
    }

    // 5. Xóa bản ghi trong database
    await prisma.productImage.delete({
      where: {
        id: productImageId,
      },
    });

    // 6. Xóa file ảnh local
    try {
      const filename = path.basename(
        new URL(image.imageUrl, "http://localhost").pathname,
      );

      const uploadDir = path.resolve(process.cwd(), "uploads", "products");

      const filePath = path.resolve(uploadDir, filename);

      // Đảm bảo file nằm trực tiếp trong thư mục uploads/products
      if (path.dirname(filePath) === uploadDir) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error("Cannot delete local image file:", error);
    }

    return NextResponse.json(
      { message: "Xóa ảnh thành công" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}
