import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // const token = (await cookies()).get("token")?.value;

    // if (!token) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // try {
    //   jwt.verify(token, process.env.JWT_SECRET!);
    // } catch (error) {
    //   return NextResponse.json(
    //     { message: "Invalid or expired token" },
    //     { status: 401 },
    //   );
    // }

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
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

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
        price: body.price,
        categoryId: body.categoryId,
        description: body.description,
      },
    });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
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

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
