import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthenticatedUser, JwtPayload } from "@/interfaces/auth";

type RequireUserResult =
  | {
      user: AuthenticatedUser;
      response: null;
    }
  | {
      user: null;
      response: NextResponse;
    };

// Chỉ xác thực JWT, không truy vấn DB
export async function getAuthenticatedUser(): Promise<JwtPayload | null> {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string" || typeof decoded.userId !== "number") {
      return null;
    }

    return {
      userId: decoded.userId,
    };
  } catch {
    return null;
  }
}

export function isAccountActive(
  user: { isActive: boolean } | null | undefined,
): boolean {
  return user?.isActive === true;
}

export async function requireUser(): Promise<RequireUserResult> {
  const authUser = await getAuthenticatedUser();

  if (!authUser) {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Vui lòng đăng nhập" },
        { status: 401 },
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.userId,
    },
    select: {
      id: true,
      fullname: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !isAccountActive(user)) {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa" },
        { status: 401 },
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

// Xác thực đăng nhập và kiểm tra quyền Admin từ DB
export async function requireAdmin() {
  const result = await requireUser();

  if (result.response) {
    return result;
  }

  if (result.user.role !== "ADMIN") {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Bạn không có quyền thực hiện thao tác này" },
        { status: 403 },
      ),
    };
  }

  return result;
}
