import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    if (authUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bạn không có quyền thực hiện thao tác này" },
        { status: 403 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        fullname: true,
        email: true,
      },
    });

    return NextResponse.json(user, { status: 200 });
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
    // 1. Xác thực người dùng
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    // 2. Kiểm tra quyền ADMIN
    if (authUser.role !== "ADMIN" && authUser.role !== "USER") {
      return NextResponse.json(
        { message: "Bạn không có quyền thực hiện thao tác này" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const userId = Number(id);

    if (authUser.role === "USER" && authUser.userId !== userId) {
      throw new Error("USER_FORBIDDEN");
    }

    const body = await request.json();

    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        fullname: body.fullname,
        email: body.email,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_FORBIDDEN") {
      return NextResponse.json(
        { message: "Bạn không có quyền cập nhật thông tin người dùng khác" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Xác thực người dùng
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    // 2. Kiểm tra quyền ADMIN
    if (authUser.role !== "ADMIN" && authUser.role !== "USER") {
      return NextResponse.json(
        { message: "Bạn không có quyền thực hiện thao tác này" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const userId = Number(id);

    if (authUser.role === "USER" && authUser.userId !== userId) {
      throw new Error("USER_FORBIDDEN");
    }

    const body = await request.json();

    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        fullname: body.fullname,
        email: body.email,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_FORBIDDEN") {
      return NextResponse.json(
        { message: "Bạn không có quyền cập nhật thông tin người dùng khác" },
        { status: 403 },
      );
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
    const { id } = await params;
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    if (authUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bạn không có quyền thực hiện thao tác này" },
        { status: 403 },
      );
    }

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json(
      { message: "Xóa người dùng thành công" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}
