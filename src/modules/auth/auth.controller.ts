// src/modules/auth/auth.controller.ts

import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";
import { AuthValidation } from "./auth.validation";
import AppError from "@/utils/AppError";

const register = catchAsync(async (req: Request) => {
  const body = await req.json();

  // Validation
  const validationResult = AuthValidation.registerValidationSchema.safeParse(body);
  
  if (!validationResult.success) {
    // ❌ Change here: .errors -> .issues
    const errorMessage = validationResult.error.issues.map(err => err.message).join(", ");
    throw new AppError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  const result = await AuthService.registerUser(validationResult.data);

  return sendResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

const login = catchAsync(async (req: Request) => {
  const body = await req.json();

  const validationResult = AuthValidation.loginValidationSchema.safeParse(body);

  if (!validationResult.success) {
    // ❌ Change here: .errors -> .issues
    const errorMessage = validationResult.error.issues.map(err => err.message).join(", ");
    throw new AppError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  const result = await AuthService.loginUser(validationResult.data);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully!",
    data: result,
  });
});

export const AuthController = {
  register,
  login,
};