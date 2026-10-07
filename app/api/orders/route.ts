import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { generateOrderCode } from "@/lib/generate-code";

interface JwtPayload {
  userId: number;
  email: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

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

    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status
        ? {
            status: status as OrderStatus,
          }
        : undefined,
      include: {
        user: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        orders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get all orders error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Lấy token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 3. Lấy dữ liệu checkout
    const body = await request.json();

    const { receiverName, phone, address, note } = body;

    if (!phone || !address) {
      return NextResponse.json(
        {
          message: "Phone and address are required",
        },
        { status: 400 },
      );
    }

    // 4. Lấy cart của user
    const cart = await prisma.cart.findUnique({
      where: {
        userId: decoded.userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!receiverName) {
      return NextResponse.json(
        {
          message: "Receiver name is required",
        },
        { status: 400 },
      );
    }

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          message: "Cart is empty",
        },
        { status: 400 },
      );
    }

    // 5. Tính tổng tiền
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // 6. Tạo Order + OrderItem
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: decoded.userId,
          orderCode: "",
          receiverName,
          phone,
          address,
          note,
          status: "PENDING",
          total,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      const orderCode = generateOrderCode(newOrder.id);

      const order = await tx.order.update({
        where: {
          id: newOrder.id,
        },
        data: {
          orderCode,
        },
        include: {
          items: true,
        },
      });

      // 7. Xóa CartItem sau khi tạo Order
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return order;
    });

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
