import { readFile, realpath } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    filename: string;
  }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { filename } = await params;

    const safeFilename = path.basename(filename);

    if (
      !filename ||
      safeFilename !== filename ||
      filename === "." ||
      filename === ".."
    ) {
      return NextResponse.json(
        { message: "Không tìm thấy ảnh" },
        { status: 404 },
      );
    }

    const uploadDir = path.resolve(process.cwd(), "uploads", "products");
    const filePath = path.resolve(uploadDir, safeFilename);

    const extension = path.extname(safeFilename).toLowerCase();

    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
    };

    const contentType = contentTypes[extension];

    if (!contentType) {
      return NextResponse.json(
        { message: "Không tìm thấy ảnh" },
        { status: 404 },
      );
    }

    const realUploadDir = await realpath(uploadDir);
    const realFilePath = await realpath(filePath);

    if (path.dirname(realFilePath) !== realUploadDir) {
      return NextResponse.json(
        { message: "Không tìm thấy ảnh" },
        { status: 404 },
      );
    }

    const file = await readFile(realFilePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      {
        message: "Không tìm thấy ảnh",
      },
      {
        status: 404,
      },
    );
  }
}
