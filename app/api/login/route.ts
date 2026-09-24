import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email hoặc password không đúng" },
        { status: 401 },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Email hoặc password không đúng" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
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
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
