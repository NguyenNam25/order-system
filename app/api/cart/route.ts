import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

interface JwtPayload {
  userId: number;
}

interface AddCartRequest {
  productId: number;
  quantity: number;
}

// GET /api/cart
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // Lấy itemIds từ URL
    const itemsParam = searchParams.get("items");

    const itemIds =
      itemsParam
        ?.split(",")
        .map(Number)
        .filter((id) => !isNaN(id)) ?? [];

    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.userId,
      },

      include: {
        items: {
          // Nếu có itemIds thì chỉ lấy những item đó
          where:
            itemIds.length > 0
              ? {
                  id: {
                    in: itemIds,
                  },
                }
              : undefined,

          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        cart,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get cart error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

// POST /api/cart
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.userId;

    const body = (await request.json()) as AddCartRequest;

    const { productId, quantity } = body;

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { message: "Invalid productId or quantity" },
        { status: 400 },
      );
    }

    // Kiểm tra product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const cartItem = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          quantity: true,
        },
      });

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const cart = await tx.cart.upsert({
        where: {
          userId: user.userId,
        },
        update: {},
        create: {
          userId: user.userId,
        },
      });

      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        select: {
          quantity: true,
        },
      });

      const totalQuantity = (existingItem?.quantity ?? 0) + quantity;

      if (totalQuantity > product.quantity) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      return tx.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        update: {
          quantity: {
            increment: quantity,
          },
        },
        create: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        message: "Product added to cart successfully",
        cartItem,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 },
        );
      }

      if (error.message === "INSUFFICIENT_STOCK") {
        return NextResponse.json(
          { message: "Số lượng vượt quá tồn kho" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
