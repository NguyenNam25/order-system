import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
}

export async function getAuthenticatedUser(): Promise<JwtPayload | null> {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string" || typeof decoded.userId !== "number") {
      return null;
    }

    return {
      userId: decoded.userId,
    };
  } catch {
    return null;
  }
}
