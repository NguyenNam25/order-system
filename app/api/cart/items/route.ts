import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function DELETE() {
  try {
    // 1. Lấy token
    const { user: authUser, response } = await requireUser();

    if (response) return response;

    const userId = authUser.id;

    // 3. Tìm cart của user
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      return NextResponse.json(
        { message: "Không tìm thấy giỏ hàng" },
        { status: 404 },
      );
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
        message: "Xóa tất cả sản phẩm khỏi giỏ hàng thành công",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}
