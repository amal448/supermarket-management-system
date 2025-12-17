import { z } from "zod";

// Base fields
const baseSchema = z.object({
  name: z.string().min(2, "Discount name is required"),
  productId: z.string().min(1, "Please select a product"),
  type: z.enum(["BUY_X_GET_Y", "PRODUCT_PERCENTAGE", "CART_PERCENTAGE"]),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
});

// Shared percentage field
const percentageField = z
  .string()
  .min(1, "Percentage is required")
  .transform(Number)
  .refine((v) => v >= 1 && v <= 100, "Percentage must be 1–100");

// Individial schemas
const buyXGetYSchema = baseSchema.extend({
  type: z.literal("BUY_X_GET_Y"),
  buyQty: z.string().min(1).transform(Number),
  getQty: z.string().min(1).transform(Number),
});

const productPercentageSchema = baseSchema.extend({
  type: z.literal("PRODUCT_PERCENTAGE"),
  percentage: percentageField,
});

const cartPercentageSchema = baseSchema.extend({
  type: z.literal("CART_PERCENTAGE"),
  minPurchaseAmountPaise: z.string().min(1).transform(Number),
  percentage: percentageField,
});

// Final Union
export const addDiscountSchema = z.discriminatedUnion("type", [
  buyXGetYSchema,
  productPercentageSchema,
  cartPercentageSchema,
]);

export type AddDiscountInput = z.infer<typeof addDiscountSchema>;
