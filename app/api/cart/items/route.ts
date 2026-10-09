import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

interface JwtPayload {
  userId: number;
}

interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.userId;

    // 3. Lấy dữ liệu từ request
    const body = (await request.json()) as AddCartItemRequest;

    const { productId, quantity } = body;

    // 4. Validate dữ liệu
    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { message: "Invalid productId or quantity" },
        { status: 400 },
      );
    }

    // 5. Kiểm tra product có tồn tại không
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // 6. Tìm Cart của user
    // Nếu chưa có → tạo Cart
    const cart = await prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    // 7. Kiểm tra CartItem
    // Nếu sản phẩm đã có → tăng quantity
    // Nếu chưa có → tạo CartItem
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });

    // 8. Trả kết quả
    return NextResponse.json(
      {
        message: "Product added to cart successfully",
        cartItem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add to cart error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // 1. Lấy token
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.userId;

    // 3. Tìm cart của user
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    // 4. Xóa tất cả CartItem của cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    // 5. Trả kết quả
    return NextResponse.json(
      {
        message: "All products removed from cart successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete all cart items error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
