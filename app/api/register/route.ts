import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/schemas/userSchema";
import { parseJsonObject } from "@/lib/parse-json-object";

export async function POST(request: Request) {
  try {
    const body = await parseJsonObject(request);

    const parsedBody = body ? userSchema.safeParse(body) : null;

    if (!parsedBody?.success) {
      return NextResponse.json(
        { message: "Thông tin đăng ký không hợp lệ" },
        { status: 400 },
      );
    }

    const { fullname, email, password, phone } = parsedBody.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        phone,
        role: "USER",
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}
