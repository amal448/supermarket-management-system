import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  category: z.enum(
    ["electronics", "grocery", "clothing", "stationery"],
    "Category is required"
  ),

  unit: z.enum(["pcs", "kg", "litre", "pack"], "Unit is required"),

  brand: z.string().min(1, "Brand is required"),

  costPrice: z
    .number({ coerce: true }) // coerce converts string -> number automatically
    .min(1, "Cost price must be greater than 0"),

  sellingPrice: z
    .number({ coerce: true }) // coerce converts string -> number automatically
    .min(1, "Selling price must be greater than 0"),
});

export type ProductInput = z.infer<typeof ProductSchema>;
