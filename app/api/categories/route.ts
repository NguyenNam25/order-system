import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { categorySchema } from "@/schemas/categoryShema";
import { parseJsonObject } from "@/lib/parse-json-object";

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

    const body = await parseJsonObject(request);
    const rawName = body?.name;

    if (typeof rawName !== "string") {
      return NextResponse.json(
        { message: "Tên danh mục không hợp lệ" },
        { status: 400 },
      );
    }

    const parsedName = categorySchema.safeParse({ name: rawName.trim() });

    if (!parsedName.success) {
      return NextResponse.json(
        { message: "Tên danh mục phải có ít nhất 2 ký tự" },
        { status: 400 },
      );
    }

    const name = parsedName.data.name;

    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "Danh mục đã tồn tại" },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Danh mục đã tồn tại" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}
