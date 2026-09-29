// app/api/orders/[id]/status/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const validStatuses = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
] as const;

const validRoles = [
  "ADMIN",
  "USER",
] as const;

export async function PATCH(
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

    const body = await request.json();

    const { status, cancelNote, role } = body;

    console.log("STATUS RECEIVED:", status);
    console.log("VALID STATUSES:", validStatuses);

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

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
        cancelNote,
        role
      },
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

    return NextResponse.json(
      {
        message: "Internal server error",
      },
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
