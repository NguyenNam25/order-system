import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

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
