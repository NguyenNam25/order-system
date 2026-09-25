import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
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
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          message: "File phải là hình ảnh",
        },
        {
          status: 400,
        },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Thư mục lưu ảnh
    const uploadDir = path.join(
      process.cwd(),
      "uploads",
      "products",
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    // Tạo tên file mới
    const extension = path.extname(file.name);

    const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    const filePath = path.join(
      uploadDir,
      fileName,
    );

    // Lưu file
    await writeFile(filePath, buffer);

    // Đường dẫn để frontend sử dụng
    const imageUrl = `/api/uploads/products/${fileName}`;

    return NextResponse.json({
      message: "Upload ảnh thành công",
      imageUrl,
    });
  } catch (error) {
    console.error(error);

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