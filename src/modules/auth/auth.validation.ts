import { z } from "zod";
import { Role } from "@prisma/client";

// 1. Zod Schemas
const registerValidationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role).optional().default(Role.TOURIST),
});

const loginValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// 2. Export Types (Inferred from Zod)
export type IRegisterUser = z.infer<typeof registerValidationSchema>;
export type ILoginUser = z.infer<typeof loginValidationSchema>;

// 1. Change Password Schema (Logged in user)
const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// 2. Forgot Password Schema (Public)
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// 3. Reset Password Schema (Public with Token)
const resetPasswordSchema = z.object({
  token: z.string({ required_error: "Token is required" }),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// 3. Export Validator
export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};