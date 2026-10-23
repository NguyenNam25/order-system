import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { generateOrderCode } from "@/lib/generate-code";
import { getAuthenticatedUser, requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const statusParam = searchParams.get("status");

    const statuses = statusParam ? statusParam.split(",") : [];

    const orders = await prisma.order.findMany({
      where:
        statuses.length > 0
          ? {
              status: {
                in: statuses as OrderStatus[],
              },
            }
          : undefined,
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            phone: true,
          },
        },
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
  } catch {
    return NextResponse.json(
      { message: "Đã xảy ra lỗi máy chủ" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    if (authUser.role !== "USER" && authUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Bạn không có quyền thực hiện thao tác này" },
        { status: 403 },
      );
    }

    const userId = authUser.userId;

    // 3. Lấy dữ liệu checkout
    const body = await request.json();

    const { receiverName, phone, address, note, itemIds } = body;

    if (
      typeof receiverName !== "string" ||
      !receiverName.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof address !== "string" ||
      !address.trim()
    ) {
      return NextResponse.json(
        {
          message: "Tên người nhận, số điện thoại và địa chỉ không được trống",
        },
        { status: 400 },
      );
    }

    if (note !== undefined && note !== null && typeof note !== "string") {
      return NextResponse.json(
        { message: "Ghi chú không hợp lệ" },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(itemIds) ||
      itemIds.length === 0 ||
      !itemIds.every((id) => Number.isInteger(id) && id > 0) ||
      new Set(itemIds).size !== itemIds.length
    ) {
      return NextResponse.json(
        { message: "ID sản phẩm trong giỏ hàng không hợp lệ" },
        { status: 400 },
      );
    }

    if (!itemIds || itemIds.length === 0) {
      return NextResponse.json(
        {
          message: "Không có sản phẩm nào trong giỏ hàng",
        },
        { status: 400 },
      );
    }

    // 6. Tạo Order + OrderItem
    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: {
          userId: userId,
        },
        include: {
          items: {
            where: {
              id: {
                in: itemIds,
              },
            },
            include: {
              product: true,
            },
          },
        },
      });

      if (
        !cart ||
        cart.items.length === 0 ||
        cart.items.length !== itemIds.length
      ) {
        throw new Error("INVALID_CART_ITEMS");
      }

      for (const item of cart.items) {
        if (item.quantity > item.product.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${item.product.name}`);
        }
      }

      //Tính tổng tiền
      const total = cart.items.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.quantity;
      }, 0);

      const newOrder = await tx.order.create({
        data: {
          userId: userId,
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
      const deletedItems = await tx.cartItem.deleteMany({
        where: {
          id: {
            in: itemIds,
          },
          cartId: cart.id,
        },
      });

      if (deletedItems.count !== cart.items.length) {
        throw new Error("CART_ITEMS_CHANGED");
      }

      return order;
    });

    return NextResponse.json(
      {
        message: "Tạo đơn hàng thành công",
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "INVALID_CART_ITEMS" ||
        error.message === "CART_ITEMS_CHANGED"
      ) {
        return NextResponse.json(
          {
            message:
              "Giỏ hàng đã thay đổi hoặc sản phẩm được chọn không hợp lệ. Vui lòng tải lại giỏ hàng.",
          },
          { status: 400 },
        );
      }
      if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
        const productName = error.message.slice("INSUFFICIENT_STOCK:".length);

        return NextResponse.json(
          {
            message: `Sản phẩm "${productName}" không đủ số lượng tồn kho. Vui lòng điều chỉnh giỏ hàng.`,
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        message: "Đã xảy ra lỗi máy chủ",
      },
      { status: 500 },
    );
  }
}
