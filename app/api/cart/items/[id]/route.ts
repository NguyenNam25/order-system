import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.userId;

    // 3. Lấy cartItemId từ URL
    const { id } = await params;
    const cartItemId = Number(id);

    if (!Number.isInteger(cartItemId)) {
      return NextResponse.json(
        { message: "Cart item ID không hợp lệ" },
        { status: 400 },
      );
    }

    // 4. Lấy dữ liệu từ request body
    const body = await request.json();
    const { quantity } = body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { message: "Số lượng không hợp lệ" },
        { status: 400 },
      );
    }

    // 5. Tìm CartItem thuộc user hiện tại
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: userId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Sản phẩm không có trong giỏ hàng" },
        { status: 404 },
      );
    }

    // 6. Kiểm tra tồn kho
    if (quantity > cartItem.product.quantity) {
      return NextResponse.json(
        { message: "Số lượng vượt quá tồn kho" },
        { status: 400 },
      );
    }

    // 7. Update quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    // 8. Trả response
    return NextResponse.json({
      message: "Cập nhật số lượng thành công",
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.userId;

    // 3. Lấy cartItemId từ URL
    const { id } = await params;
    const cartItemId = Number(id);

    if (!Number.isInteger(cartItemId)) {
      return NextResponse.json(
        { message: "Cart item ID không hợp lệ" },
        { status: 400 },
      );
    }

    const result = await prisma.cartItem.deleteMany({
      where: {
        id: cartItemId,
        cart: {
          userId: user.userId,
        },
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm trong giỏ hàng của bạn" },
        { status: 404 },
      );
    }
    // 8. Trả response
    return NextResponse.json({
      message: "Cart item deleted successfully",
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
