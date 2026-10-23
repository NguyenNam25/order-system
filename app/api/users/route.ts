import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    if (authUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bạn không có quyền thực hiện thao tác này" },
        { status: 403 },
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
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
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    if (authUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bạn không có quyền thực hiện thao tác này" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        fullname: body.fullname,
        email: body.email,
        phone: body.phone,
        role: body.role,
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
