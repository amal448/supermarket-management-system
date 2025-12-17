import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(1, "User name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "manager", "cashier", "staff"], "Role is required"),
});

export type UserSchemaType = z.infer<typeof userSchema>;
