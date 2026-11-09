import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { isAccountActive } from "@/lib/auth";
import { parseJsonObject } from "@/lib/parse-json-object";

export async function POST(request: Request) {
  try {
    const body = await parseJsonObject(request);

    if (!body) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu không hợp lệ" },
        { status: 400 },
      );
    }

    const { email, password } = body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu không hợp lệ" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email hoặc password không đúng" },
        { status: 401 },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Email hoặc password không đúng" },
        { status: 401 },
      );
    }

    if (!isAccountActive(user)) {
      return NextResponse.json(
        { message: "Tài khoản đã bị vô hiệu hóa" },
        { status: 403 },
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );

    const res = NextResponse.json({
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}
