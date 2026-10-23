import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import { Prisma } from "@prisma/client";

// GET /api/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Get product error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Xác thực người dùng
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Kiểm tra quyền ADMIN
    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 3. Kiểm tra ID sản phẩm
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 },
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // 4. Kiểm tra dữ liệu đầu vào
    const body = await request.json();
    const { name, price, quantity, categoryId, description } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      !Number.isInteger(categoryId) ||
      categoryId <= 0 ||
      (description !== undefined && typeof description !== "string")
    ) {
      return NextResponse.json(
        { message: "Invalid product data" },
        { status: 400 },
      );
    }

    // 5. Kiểm tra tên trùng với sản phẩm khác
    const duplicateProduct = await prisma.product.findFirst({
      where: {
        name: name.trim(),
        NOT: { id: productId },
      },
    });

    if (duplicateProduct) {
      return NextResponse.json(
        { message: "Product already exists" },
        { status: 400 },
      );
    }

    // 6. Kiểm tra danh mục tồn tại
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 400 },
      );
    }

    // 7. Cập nhật sản phẩm
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name.trim(),
        price,
        quantity,
        categoryId,
        description,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Update product error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Xác thực người dùng
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Kiểm tra quyền ADMIN
    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 3. Kiểm tra ID sản phẩm
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 },
      );
    }

    // 4. Lấy thông tin ảnh trước khi xóa sản phẩm
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // 5. Xóa sản phẩm trong database
    // Lưu ý: nếu sản phẩm đã nằm trong đơn hàng, database có thể từ chối xóa.
    await prisma.product.delete({
      where: { id: productId },
    });

    // 6. Xóa các file ảnh lưu trên local
    const uploadDir = path.resolve(process.cwd(), "uploads", "products");
    
    for (const image of product.images) {
      try {
        const pathname = new URL(image.imageUrl, "http://localhost").pathname;

        const prefix = "/api/uploads/products/";

        if (!pathname.startsWith(prefix)) {
          console.error("Invalid product image URL:", image.imageUrl);
          continue;
        }

        const filename = pathname.slice(prefix.length);

        if (
          !filename ||
          filename !== path.basename(filename) ||
          filename.includes("\\") ||
          filename === "." ||
          filename === ".."
        ) {
          console.error("Invalid image filename:", filename);
          continue;
        }

        const filePath = path.resolve(uploadDir, filename);

        // Đảm bảo file nằm trực tiếp trong uploadDir
        if (path.dirname(filePath) !== uploadDir) {
          console.error("Image path is outside upload directory");
          continue;
        }

        await fs.unlink(filePath);
      } catch (error) {
        console.error("Cannot delete product image:", error);
      }
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            message:
              "Không thể xóa sản phẩm vì sản phẩm đang được sử dụng trong đơn hàng hoặc dữ liệu liên quan.",
          },
          { status: 400 },
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Không tìm thấy sản phẩm cần xóa." },
          { status: 404 },
        );
      }
    }

    console.error("Delete product error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
