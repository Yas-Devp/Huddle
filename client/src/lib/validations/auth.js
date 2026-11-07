import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

const requiredPasswordSchema = z.string().min(1, "Password is required");

const newPasswordSchema = requiredPasswordSchema
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be 72 characters or fewer");

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(24, "Username must be 24 characters or fewer")
  .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only");

export const loginSchema = z.object({
  email: emailSchema,
  password: requiredPasswordSchema,
  remember: z.boolean(),
});

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
