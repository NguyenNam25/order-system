
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface JwtPayload {
  userId: number;
  role: "ADMIN" | "USER";
}

// Chỉ xác thực JWT, không truy vấn DB
export async function getAuthenticatedUser(): Promise<JwtPayload | null> {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "number" ||
      (decoded.role !== "ADMIN" && decoded.role !== "USER")
    ) {
      return null;
    }

    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

// Xác thực đăng nhập và kiểm tra quyền Admin từ DB
export async function requireAdmin() {
  const authUser = await getAuthenticatedUser();

  if (!authUser) {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    select: {
      id: true,
      fullname: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      ),
    };
  }

  if (user.role !== "ADMIN") {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Bạn không có quyền thực hiện thao tác này" },
        { status: 403 },
      ),
    };
  }

  return {
    user,
    response: null,
  };
}
