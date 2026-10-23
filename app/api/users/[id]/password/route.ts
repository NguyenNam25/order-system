import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getAuthenticatedUser } from "@/lib/auth";

export async function PATCH(
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
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      body.currentPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Mật khẩu hiện tại không đúng" },
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
      { message: "Cập nhật mật khẩu mới thành công" },
      { status: 200 },
    );
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
