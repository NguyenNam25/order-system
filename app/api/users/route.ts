import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { userCreateSchema } from "@/schemas/userSchema";
import { parseJsonObject } from "@/lib/parse-json-object";

export async function GET(request: Request) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    if (role !== null && role !== "ADMIN" && role !== "USER") {
      return NextResponse.json(
        { message: "Vai trò người dùng không hợp lệ" },
        { status: 400 },
      );
    }

    const users = await prisma.user.findMany({
      where: role !== null ? { role } : undefined,
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const body = await parseJsonObject(request);

    const parsedBody = body ? userCreateSchema.safeParse(body) : null;

    if (!parsedBody?.success) {
      return NextResponse.json(
        { message: "Dữ liệu người dùng không hợp lệ" },
        { status: 400 },
      );
    }

    const userData = parsedBody.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        fullname: userData.fullname,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}