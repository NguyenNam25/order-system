import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

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
    // 1. Xác thực người dùng
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Kiểm tra quyền ADMIN
    const user = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
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
        { message: "Invalid product or image ID" },
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
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
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
      { message: "Image deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete product image error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
