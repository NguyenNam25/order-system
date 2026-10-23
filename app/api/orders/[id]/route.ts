import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ message: "Bạn chưa đăng nhập" }, { status: 401 });
    }

    if (authUser.role !== "USER" && authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Bạn không có quyền thực hiện thao tác này" }, { status: 403 });
    }

    const userId = authUser.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "Dữ liệu trong token không hợp lệ" },
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
      return NextResponse.json({ message: "Không tìm thấy người dùng" }, { status: 404 });
    }

    const { id } = await params;
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { message: "Id đơn hàng không hợp lệ" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { status, cancelNote, returnNote, returnMethod, returnRejectNote } =
      body;

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Trạng thái đơn hàng không hợp lệ" },
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

      // Chỉ cho phép USER và ADMIN thực hiện thao tác
      if (user.role !== "USER" && user.role !== "ADMIN") {
        throw new Error("FORBIDDEN");
      }

      // USER chỉ được thao tác trên đơn hàng của chính mình
      if (user.role === "USER" && currentOrder.userId !== user.id) {
        throw new Error("ORDER_FORBIDDEN");
      }

      if (user.role === "USER") {
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
      // Khi CONFIRMED → trừ stock
      if (currentOrder.status === "PENDING" && status === "CONFIRMED") {
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
      }
      // Khi RETURN APPROVE → cộng stock
      if (
        currentOrder.status === "RETURN_REQUESTED" &&
        status === "RETURN_APPROVED" &&
        returnMethod === "REFUND"
      ) {
        for (const item of currentOrder.items) {
          const product = await tx.product.findUnique({
            where: {
              id: item.productId,
            },
            select: {
              id: true,
            },
          });

          if (!product) {
            throw new Error("PRODUCT_NOT_FOUND");
          }

          await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              quantity: {
                increment: item.quantity,
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
        return NextResponse.json({ message: "Bạn không có quyền thực hiện thao tác này" }, { status: 403 });
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
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json({ message: "Bạn chưa đăng nhập" }, { status: 401 });
    }

    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Bạn không có quyền thực hiện thao tác này" }, { status: 403 });
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
  } catch (error) {
    return NextResponse.json(
      {
        message: "Đã xảy ra lỗi máy chủ",
      },
      { status: 500 },
    );
  }
}
