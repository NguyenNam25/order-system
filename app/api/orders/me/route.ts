import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

interface JwtPayload {
  userId: number;
  email: string;
}

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = authUser.userId;

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
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
  } catch (error) {
    console.error("Get my orders error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
