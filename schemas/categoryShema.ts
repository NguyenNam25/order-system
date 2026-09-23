import z from "zod";

export const categorySchema = z.object({
  name: z
    .string({ message: "Category name is required" })
    .min(2, "Category name is required")
    .regex(/^.+$/u),
});

