import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";

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

type OrderStatus = (typeof validStatuses)[number];

function isValidOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    validStatuses.some((status) => status === value)
  );
}

const validReturnMethods = ["REFUND", "EXCHANGE"] as const;
type ReturnMethod = (typeof validReturnMethods)[number];

function isValidReturnMethod(value: unknown): value is ReturnMethod {
  return (
    typeof value === "string" &&
    validReturnMethods.some((method) => method === value)
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user: authUser, response } = await requireUser();

    if (response) return response;

    const userId = authUser.id;
    const role = authUser.role;

    if (!userId) {
      return NextResponse.json(
        { message: "Dữ liệu trong token không hợp lệ" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const orderId = Number(id);
    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { message: "Id đơn hàng không hợp lệ" },
        { status: 400 },
      );
    }

    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Dữ liệu yêu cầu không hợp lệ" },
        { status: 400 },
      );
    }

    const { status, cancelNote, returnNote, returnMethod, returnRejectNote } =
      body as Record<string, unknown>;

    if (!isValidOrderStatus(status)) {
      return NextResponse.json(
        { message: "Trạng thái đơn hàng không hợp lệ" },
        { status: 400 },
      );
    }

    const validatedReturnMethod: ReturnMethod | null =
      status === "RETURN_APPROVED"
        ? isValidReturnMethod(returnMethod)
          ? returnMethod
          : null
        : null;

    if (status === "RETURN_APPROVED" && !validatedReturnMethod) {
      return NextResponse.json(
        { message: "Vui lòng chọn phương thức trả hàng hợp lệ" },
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
      if (role !== "USER" && role !== "ADMIN") {
        throw new Error("FORBIDDEN");
      }
      if (role === "USER" && currentOrder.userId !== userId) {
        throw new Error("ORDER_FORBIDDEN");
      }
      if (role === "USER") {
        const isAllowedUserTransition =
          (currentOrder.status === "PENDING" && status === "CANCELLED") ||
          (currentOrder.status === "COMPLETED" &&
            status === "RETURN_REQUESTED") ||
          (currentOrder.status === "SHIPPING" && status === "COMPLETED");

        if (!isAllowedUserTransition) {
          throw new Error("FORBIDDEN_STATUS_TRANSITION");
        }
      }
      const allowedStatuses = allowedTransitions[currentOrder.status];
      if (!allowedStatuses.includes(status)) {
        throw new Error("INVALID_STATUS_TRANSITION");
      }

      const orderData = {
        status,
        ...(status === "CANCELLED"
          ? {
              cancelNote: cancelNote ?? null,
              role: role,
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
      };

      if (currentOrder.status === "PENDING" && status === "CONFIRMED") {
        const claimedOrder = await tx.order.updateMany({
          where: {
            id: orderId,
            status: "PENDING",
          },
          data: {
            status: status,
          },
        });
        if (claimedOrder.count === 0) {
          throw new Error("ORDER_ALREADY_PROCESSED");
        }
        for (const item of currentOrder.items) {
          const result = await tx.product.updateMany({
            where: {
              id: item.productId,
              quantity: {
                gte: item.quantity,
              },
            },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
          if (result.count === 0) {
            const product = await tx.product.findUnique({
              where: {
                id: item.productId,
              },
              select: {
                name: true,
              },
            });
            if (!product) {
              throw new Error("PRODUCT_NOT_FOUND");
            }
            throw new Error(`OUT_OF_STOCK:${product.name}`);
          }
        }
      } else if (
        currentOrder.status === "RETURN_REQUESTED" &&
        status === "RETURN_APPROVED"
      ) {
        const claimedOrder = await tx.order.updateMany({
          where: {
            id: orderId,
            status: "RETURN_REQUESTED",
          },
          data: {
            status: status,
            returnMethod: validatedReturnMethod,
          },
        });
        if (claimedOrder.count === 0) {
          throw new Error("ORDER_ALREADY_PROCESSED");
        }
        if (validatedReturnMethod === "REFUND") {
          for (const item of currentOrder.items) {
            const result = await tx.product.updateMany({
              where: {
                id: item.productId,
              },
              data: {
                quantity: {
                  increment: item.quantity,
                },
              },
            });
            if (result.count === 0) {
              throw new Error("PRODUCT_NOT_FOUND");
            }
          }
        }
      } else {
        return tx.order.update({
          where: {
            id: orderId,
          },
          data: orderData,
          include: {
            items: true,
          },
        });
      }

      const updatedOrder = await tx.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          items: true,
        },
      });
      if (!updatedOrder) {
        throw new Error("ORDER_NOT_FOUND");
      }
      return updatedOrder;
    });

    return NextResponse.json(
      {
        message: "Cập nhật trạng thái đơn hàng thành công",
        order,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return NextResponse.json(
          { message: "Không tìm thấy đơn hàng" },
          { status: 404 },
        );
      }

      if (error.message === "PRODUCT_NOT_FOUND") {
        return NextResponse.json(
          { message: "Không tìm thấy sản phẩm" },
          { status: 404 },
        );
      }

      if (error.message === "INVALID_STATUS_TRANSITION") {
        return NextResponse.json(
          { message: "Không thể chuyển sang trạng thái này" },
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

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          { message: "Bạn không có quyền thực hiện thao tác này" },
          { status: 403 },
        );
      }

      if (error.message === "ORDER_FORBIDDEN") {
        return NextResponse.json(
          { message: "Bạn không có quyền thao tác đơn hàng này" },
          { status: 403 },
        );
      }

      if (error.message === "FORBIDDEN_STATUS_TRANSITION") {
        return NextResponse.json(
          { message: "Bạn không có quyền thực hiện thao tác này" },
          { status: 403 },
        );
      }

      if (error.message === "ORDER_ALREADY_PROCESSED") {
        return NextResponse.json(
          { message: "Đơn hàng đã được chuyển trạng thái" },
          { status: 400 },
        );
      }
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message: "Dữ liệu bị trùng. Vui lòng kiểm tra lại thông tin.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await params;

    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { message: "Id đơn hàng không hợp lệ" },
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
        message: "Xóa đơn hàng thành công",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Đã xảy ra lỗi máy chủ",
      },
      { status: 500 },
    );
  }
}
