import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    filename: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { filename } = await params;

    const filePath = path.join(
      process.cwd(),
      "uploads",
      "products",
      filename,
    );

    const file = await readFile(filePath);

    const extension = path.extname(filename).toLowerCase();

    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
    };

    const contentType =
      contentTypes[extension] ?? "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
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