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
