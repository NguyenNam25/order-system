import z from "zod";

export const productSchema = z.object({
  name: z
    .string({ message: "Product name is required" })
    .min(2, "Product name is required")
    .regex(/^.+$/u),
  price: z
    .number({ message: "Price required" })
    .min(1000, "Price must be greater than 1000"),
  categoryId: z.number(),
  description: z.string(),
});

