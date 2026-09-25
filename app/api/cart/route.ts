import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface JwtPayload {
  userId: number;
}

interface AddCartRequest {
  productId: number;
  quantity: number;
}

// GET /api/cart
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const userId = decoded.userId;

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
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

    if (!cart) {
      return NextResponse.json(
        {
          message: "Cart is empty",
          cart: null,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Get cart error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cart
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const userId = decoded.userId;

    const body = (await request.json()) as AddCartRequest;

    const { productId, quantity } = body;

    console.log("CART BODY:", body);
    console.log("productId:", productId);
    console.log("quantity:", quantity);

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

    // Tìm Cart, nếu chưa có thì tạo
    const cart = await prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    // Thêm CartItem hoặc tăng quantity
    const cartItem = await prisma.cartItem.upsert({
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

    return NextResponse.json(
      {
        message: "Product added to cart successfully",
        cartItem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add to cart error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
