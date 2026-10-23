import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ message: "Bạn chưa đăng nhập" }, { status: 401 });
    }

    if (authUser.role !== "USER" && authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Bạn không có quyền thực hiện thao tác này" }, { status: 403 });
    }

    const userId = authUser.userId;

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        orders,
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
