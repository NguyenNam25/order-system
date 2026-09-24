import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
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

    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
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

    const body = await request.json();

    const existingProduct = await prisma.product.findFirst({
      where: {
        name: body.name,
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: "Product already exists" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        categoryId: body.categoryId,
        description: body.description,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
