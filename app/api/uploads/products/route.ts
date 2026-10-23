import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(request: NextRequest) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message: "File không hợp lệ",
        },
        {
          status: 400,
        },
      );
    }

    // Kiểm tra loại file
    const extension = allowedMimeTypes[file.type];

    if (!extension) {
      return NextResponse.json(
        { message: "Chỉ chấp nhận file JPG, JPEG, PNG hoặc WEBP" },
        { status: 400 },
      );
    }

    //Giới hạn dung lượng
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File phải có dung lượng từ 1 byte đến 5 MB" },
        { status: 400 },
      );
    }

    // Đọc nội dung file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Thư mục lưu ảnh
    const uploadDir = path.join(process.cwd(), "uploads", "products");

    await mkdir(uploadDir, {
      recursive: true,
    });

    // Tạo tên file mới
    const fileName = `${crypto.randomUUID()}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    // Lưu file
    await writeFile(filePath, buffer);

    // Đường dẫn để frontend sử dụng
    const imageUrl = `/api/uploads/products/${fileName}`;

    return NextResponse.json({
      message: "Upload ảnh thành công",
      imageUrl,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Upload ảnh thất bại",
      },
      {
        status: 500,
      },
    );
  }
}
