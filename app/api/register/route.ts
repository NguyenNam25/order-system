import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        fullname: body.fullname,
        email: body.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
      },
    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
