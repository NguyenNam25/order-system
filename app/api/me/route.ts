import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user,
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
