// app/api/orders/[id]/status/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getAuthenticatedUser } from "@/lib/auth";

const validStatuses = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "RETURN_REJECTED",
] as const;

const allowedTransitions: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING"],
  SHIPPING: ["COMPLETED"],
  COMPLETED: ["RETURN_REQUESTED"],
  CANCELLED: [],
  RETURN_REQUESTED: ["RETURN_APPROVED", "RETURN_REJECTED"],
  RETURN_APPROVED: [],
  RETURN_REJECTED: [],
};

const validRoles = ["ADMIN", "USER"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = authUser.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 },
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        role: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { message: "Invalid order id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { status, cancelNote, returnNote, returnMethod, returnRejectNote } =
      body;

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid order status" },
        { status: 400 },
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          items: true,
        },
      });
      if (!currentOrder) {
        throw new Error("ORDER_NOT_FOUND");
      }
      const allowedStatuses = allowedTransitions[currentOrder.status];

      if (!allowedStatuses.includes(status)) {
        throw new Error("INVALID_STATUS_TRANSITION");
      }
      // Khi CONFIRMED → trừ stock
      if (currentOrder.status === "PENDING" && status === "CONFIRMED") {
        for (const item of currentOrder.items) {
          const product = await tx.product.findUnique({
            where: {
              id: item.productId,
            },
          });

          if (!product) {
            throw new Error("PRODUCT_NOT_FOUND");
          }

          if (product.quantity < item.quantity) {
            throw new Error(`OUT_OF_STOCK:${product.name}`);
          }

          await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }
      // Update Order
      return tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status,
          // Chỉ lưu cancelNote khi huỷ
          ...(status === "CANCELLED"
            ? {
                cancelNote: cancelNote ?? null,
                role: user.role,
              }
            : {}),
          ...(status === "RETURN_REQUESTED"
            ? {
                returnNote: returnNote ?? null,
              }
            : {}),
          ...(status === "RETURN_APPROVED"
            ? {
                returnMethod: returnMethod ?? null,
              }
            : {}),
          ...(status === "RETURN_REJECTED"
            ? {
                returnRejectNote: returnRejectNote ?? null,
              }
            : {}),
        },
      });
    });

    return NextResponse.json(
      {
        message: "Order status updated successfully",
        order,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update order status error:", error);

    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 },
        );
      }

      if (error.message === "PRODUCT_NOT_FOUND") {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 },
        );
      }

      if (error.message === "INVALID_STATUS_TRANSITION") {
        return NextResponse.json(
          { message: "Invalid status transition" },
          { status: 400 },
        );
      }

      if (error.message.startsWith("OUT_OF_STOCK:")) {
        const productName = error.message.replace("OUT_OF_STOCK:", "");

        return NextResponse.json(
          {
            message: `Sản phẩm "${productName}" không đủ số lượng`,
          },
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { message: "Invalid order id" },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: {
          orderId,
        },
      });

      await tx.order.delete({
        where: {
          id: orderId,
        },
      });
    });

    return NextResponse.json(
      {
        message: "Order status updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update order status error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
