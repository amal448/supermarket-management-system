// src/lib/validation/addBranchValidation.ts
import { z } from "zod";

export const addBranchSchema = z.object({
  name: z
    .string()
    .min(2, "Branch name must be at least 2 characters")
    .max(50, "Branch name cannot exceed 50 characters"),

  location: z
    .string()
    .min(2, "Location is required")
    .max(100, "Location too long"),

  managerId: z
    .string()
    .min(1, "Please select a manager"),
});

export type AddBranchInput = z.infer<typeof addBranchSchema>;
