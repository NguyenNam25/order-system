import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(
      body.currentPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);

    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
