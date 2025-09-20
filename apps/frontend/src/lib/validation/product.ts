import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().optional(),
});
