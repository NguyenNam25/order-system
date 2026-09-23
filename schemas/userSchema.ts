import { PasswordUpdate } from "./../types/user";
import z from "zod";

const fullname = z
  .string({ message: "Full Name is required" })
  .min(1, "Full name is required")
  .regex(/^[\p{L}\s]+$/u, "Full name can only contain letters and spaces");

const email = z
  .string({ message: "Email is required" })
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "This is not email");

const password = z
  .string({ message: "Password is required" })
  .min(6, "Password must contain at least 6 characters")
  .regex(/[A-Za-z]/, "Password must contain at least 1 character (a-z)");

export const userSchema = z.object({ fullname, email, password });

export const updateUserSchema = z.object({ fullname, email });

export const PasswordUpdateSchema = z
  .object({
    currentPassword: z.string({ message: "Please confirm your password" }),
    newPassword: password,
    confirmPassword: z.string({ message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });
