import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const productId = Number(id);

    const image = await prisma.productImage.create({
      data: {
        imageUrl: body.imageUrl,
        productId,
      },
    });

    return NextResponse.json(image, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

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

    const productId = Number(id);
    const productImageId = Number(imageId);

    // Kiểm tra image có thực sự thuộc product này không
    const image = await prisma.productImage.findFirst({
      where: {
        id: productImageId,
        productId,
      },
    });

    if (!image) {
      return NextResponse.json(
        { message: "Không tìm thấy ảnh" },
        { status: 404 },
      );
    }

    await prisma.productImage.delete({
      where: {
        id: productImageId,
      },
    });

    return NextResponse.json(
      {
        message: "Xóa ảnh thành công",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}