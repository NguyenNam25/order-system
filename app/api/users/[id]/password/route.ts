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

    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "ID người dùng không hợp lệ" },
        { status: 400 },
      );
    }

    // Chỉ cho phép đổi mật khẩu của chính mình
    if (authUser.userId !== userId) {
      return NextResponse.json(
        { message: "Bạn không có quyền đổi mật khẩu người dùng khác" },
        { status: 403 },
      );
    }

    const body = await request.json();

    if (
      typeof body.currentPassword !== "string" ||
      typeof body.newPassword !== "string" ||
      !body.currentPassword ||
      body.newPassword.length < 8
    ) {
      return NextResponse.json(
        { message: "Mật khẩu hiện tại không hợp lệ hoặc mật khẩu mới phải có ít nhất 8 ký tự" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng hoặc tài khoản đã bị khóa" },
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

    if (body.currentPassword === body.newPassword) {
      return NextResponse.json(
        { message: "Mật khẩu mới phải khác mật khẩu hiện tại" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Cập nhật mật khẩu mới thành công" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}