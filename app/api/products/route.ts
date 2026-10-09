import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

// GET /api/products
export async function GET(request: Request) {
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
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
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
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Lấy thông tin người dùng từ database
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
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 },
      );
    }

    // 3. Chỉ ADMIN được thêm sản phẩm
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 },
      );
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
        { message: "Invalid product data" },
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
        { message: "Product already exists" },
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
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}