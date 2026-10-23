import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();

    return NextResponse.json(categories, { status: 200 });
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

    const body = await request.json();

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: body.name,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "Danh mục đã tòn tại" },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}
