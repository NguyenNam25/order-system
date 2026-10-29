import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { requireUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user: authUser, response } = await requireUser();

    if (response) return response;

    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "ID người dùng không hợp lệ" },
        { status: 400 },
      );
    }

    const isAdmin = authUser.role === "ADMIN";
    const isSelf = authUser.id === userId;

    if (!isAdmin && !isSelf) {
      return NextResponse.json(
        { message: "Bạn không có quyền đổi mật khẩu người dùng khác" },
        { status: 403 },
      );
    }

    const body = await request.json();

    if (typeof body.newPassword !== "string" || body.newPassword.length < 8) {
      return NextResponse.json(
        { message: "Mật khẩu mới phải có ít nhất 8 ký tự" },
        { status: 400 },
      );
    }

    const isChangingOwnPassword = authUser.id === userId;

    if (isChangingOwnPassword) {
      if (typeof body.currentPassword !== "string" || !body.currentPassword) {
        return NextResponse.json(
          { message: "Vui lòng nhập mật khẩu hiện tại" },
          { status: 400 },
        );
      }
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        isActive: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    if (isChangingOwnPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        body.currentPassword,
        targetUser.password,
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
