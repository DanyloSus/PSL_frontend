import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(64, "Max 64 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Letters, digits, _ . - only"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .max(128, "Max 128 characters")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required")
});

export type RegisterValues = z.infer<typeof registerSchema>;
export type LoginValues = z.infer<typeof loginSchema>;

export const userRoleSchema = z.enum(["USER", "ADMIN"]);

export const userPublicSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  role: userRoleSchema,
  global_xp: z.number(),
  global_level: z.number()
});

export const authResponseSchema = z.object({
  user: userPublicSchema
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserPublic = z.infer<typeof userPublicSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
