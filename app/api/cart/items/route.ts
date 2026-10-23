import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function DELETE() {
  try {
    // 1. Lấy token
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: "Bạn chưa đăng nhập" }, { status: 401 });
    }

    const userId = user.userId;

    // 3. Tìm cart của user
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      return NextResponse.json({ message: "Không tìm thấy giỏ hàng" }, { status: 404 });
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
