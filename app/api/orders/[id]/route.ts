// app/api/orders/[id]/status/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const validStatuses = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
] as const;

const validRoles = ["ADMIN", "USER"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { message: "Invalid order id" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const { status, cancelNote, role } = body;

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid order status" },
        { status: 400 },
      );
    }

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: "Invalid order role" },
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
        throw new Error("Order not found");
      }

      if (currentOrder.status === "PENDING" && status === "CONFIRMED") {
        for (const item of currentOrder.items) {
          const product = await tx.product.findUnique({
            where: {
              id: item.productId,
            },
          });
          if ((product?.quantity ?? 0) < item.quantity) {
            throw new Error(`Out of Stock: ${product?.name}`);
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
      return tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          status,
          cancelNote,
          role,
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
