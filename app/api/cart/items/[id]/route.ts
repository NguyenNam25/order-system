import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import {prisma} from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Lấy token từ cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    const userId = decoded.userId;

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