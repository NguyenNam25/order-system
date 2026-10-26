import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const { user, response } = await requireUser();

  if (response) {
    return response;
  }

  return NextResponse.json({
    user: {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
}
