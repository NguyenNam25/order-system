import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      imageId: string;
    }>;
  },
) {
  try {
    const { id, imageId } = await params;
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    let decoded: { userId: number };

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const productId = Number(id);
    const productImageId = Number(imageId);

    // 1. Tìm image
    const image = await prisma.productImage.findFirst({
      where: {
        id: productImageId,
        productId,
      },
    });

    if (!image) {
      return NextResponse.json(
        { message: "Image not found" },
        { status: 404 },
      );
    }

    // 2. Xóa record trong database
    await prisma.productImage.delete({
      where: {
        id: productImageId,
      },
    });

    // 3. Xóa file vật lý
    const filename = path.basename(image.imageUrl);

    const filePath = path.join(
      process.cwd(),
      "uploads",
      "products",
      filename,
    );

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(
        `Cannot delete image file: ${filePath}`,
        error,
      );
    }

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}