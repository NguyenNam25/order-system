import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

// GET /api/products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}

// POST /api/products
export async function POST(request: Request) {
  try {
    // 1. Xác thực người dùng
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ message: "Bạn chưa đăng nhập" }, { status: 401 });
    }

    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Bạn không có quyền thực hiện thao tác này" }, { status: 403 });
    }

    // 4. Lấy dữ liệu từ request
    const body = await request.json();

    const { name, price, categoryId, quantity, description } = body;

    // 5. Kiểm tra dữ liệu đầu vào
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(categoryId) ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return NextResponse.json(
        { message: "Dữ liệu sản phẩm không hợp lệ" },
        { status: 400 },
      );
    }

    // 6. Kiểm tra sản phẩm đã tồn tại
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: name.trim(),
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: "Sản phẩm đã tồn tại" },
        { status: 400 },
      );
    }

    // 7. Tạo sản phẩm
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price,
        categoryId,
        quantity,
        description,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}
