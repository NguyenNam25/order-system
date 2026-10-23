import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

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
    const { id } = await params;
    const body = await request.json();
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(category, { status: 202 });
  } catch {
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
    const { id } = await params;
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    await prisma.category.delete({
      where: {
        id: Number(id),
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
