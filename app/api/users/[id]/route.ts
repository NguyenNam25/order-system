import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAdmin } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await params;

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
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "ID người dùng không hợp lệ" },
        { status: 400 },
      );
    }

    // Lấy role hiện tại từ DB
    const currentUser = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    // USER chỉ được cập nhật thông tin của chính mình
    if (currentUser.role === "USER" && currentUser.id !== userId) {
      return NextResponse.json(
        {
          message: "Bạn không có quyền cập nhật thông tin người dùng khác",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const user = await prisma.user.update({
      where: {
        id: userId,
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
  } catch {
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
    // 1. Xác thực JWT
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    // 2. Lấy role hiện tại từ DB
    const currentUser = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    // 3. Lấy và kiểm tra ID người dùng cần cập nhật
    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "ID người dùng không hợp lệ" },
        { status: 400 },
      );
    }

    // 4. USER chỉ được cập nhật chính mình
    if (currentUser.role === "USER" && currentUser.id !== userId) {
      return NextResponse.json(
        {
          message: "Bạn không có quyền cập nhật thông tin người dùng khác",
        },
        { status: 403 },
      );
    }

    // 5. Cập nhật thông tin
    const body = await request.json();

    const user = await prisma.user.update({
      where: { id: userId },
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
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await params;

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
