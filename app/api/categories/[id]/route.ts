import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { parseJsonObject } from "@/lib/parse-json-object";
import { categorySchema } from "@/schemas/categoryShema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const categoryId = Number(id);

    if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { message: "Id danh mục không hợp lệ" },
        { status: 400 },
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Không tìm thấy danh mục" },
        { status: 404 },
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await params;

    const categoryId = Number(id);

    if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { message: "Id danh mục không hợp lệ" },
        { status: 400 },
      );
    }

    const body = await parseJsonObject(request);

    if (typeof body?.name !== "string") {
      return NextResponse.json(
        { message: "Tên danh mục không hợp lệ" },
        { status: 400 },
      );
    }

    const parsedName = categorySchema.safeParse({ name: body.name.trim() });

    if (!parsedName.success) {
      return NextResponse.json(
        { message: "Tên danh mục phải có ít nhất 2 ký tự" },
        { status: 400 },
      );
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: parsedName.data.name,
        NOT: { id: categoryId },
      },
      select: { id: true },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "Danh mục đã tồn tại" },
        { status: 409 },
      );
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: parsedName.data.name,
      },
    });
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "Danh mục đã tồn tại" },
          { status: 409 },
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Không tìm thấy danh mục cần cập nhật." },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await params;

    const categoryId = Number(id);

    if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { message: "Id danh mục không hợp lệ" },
        { status: 400 },
      );
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(
      { message: "Xóa danh mục thành công" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            message:
              "Không thể xóa danh mục vì vẫn còn sản phẩm hoặc dữ liệu liên quan đang sử dụng danh mục này.",
          },
          { status: 400 },
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Không tìm thấy danh mục cần xóa." },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}
