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

// 3. Export Validator
export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};