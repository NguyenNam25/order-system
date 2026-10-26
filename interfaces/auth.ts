export interface JwtPayload {
  userId: number;
}

export interface AuthenticatedUser {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  role: "ADMIN" | "USER";
  isActive: boolean;
}