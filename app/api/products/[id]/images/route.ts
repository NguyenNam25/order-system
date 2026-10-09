import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";

// POST /api/products/[id]/images
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Xác thực người dùng
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Kiểm tra quyền ADMIN
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 },
      );
    }

    // 3. Kiểm tra productId
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // 4. Kiểm tra imageUrl
    const body = await request.json();

    if (
      typeof body.imageUrl !== "string" ||
      !body.imageUrl.trim()
    ) {
      return NextResponse.json(
        { message: "Invalid image URL" },
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
  } catch (error) {
    console.error("Create product image error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id]/images/[imageId]
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
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Kiểm tra quyền ADMIN
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 },
      );
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

    // 4. Xác nhận ảnh thuộc đúng sản phẩm
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

    // 5. Xóa bản ghi ảnh trong database
    await prisma.productImage.delete({
      where: { id: productImageId },
    });

    // 6. Xóa file ảnh local
    // Chỉ xóa file nằm trong thư mục uploads/products.
    try {
      const filename = path.basename(
        new URL(image.imageUrl, "http://localhost").pathname,
      );

      const uploadDir = path.resolve(
        process.cwd(),
        "uploads",
        "products",
      );

      const filePath = path.resolve(uploadDir, filename);

      if (path.dirname(filePath) === uploadDir) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      // Bản ghi DB đã xóa; lỗi file không làm thay đổi kết quả đó.
      console.error("Cannot delete local image file:", error);
    }

    return NextResponse.json(
      { message: "Xóa ảnh thành công" },
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