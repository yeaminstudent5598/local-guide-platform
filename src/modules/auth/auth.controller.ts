import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";
import { AuthValidation } from "./auth.validation";
import { authGuard } from "@/utils/authGuard";
import AppError from "@/utils/AppError";

const register = catchAsync(async (req: Request) => {
  const body = await req.json();

  const validationResult = AuthValidation.registerValidationSchema.safeParse(body);
  
  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues.map(err => err.message).join(", ");
    throw new AppError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  const result = await AuthService.registerUser(validationResult.data);

  return sendResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "OTP sent successfully! Please check your email.",
    data: result,
  });
});

const verify = catchAsync(async (req: Request) => {
  const body = await req.json();
  
  if(!body.email || !body.otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email and OTP are required");
  }

  const result = await AuthService.verifyOtp(body.email, body.otp);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Account verified successfully!",
    data: result,
  });
});

const login = catchAsync(async (req: Request) => {
  const body = await req.json();

  const validationResult = AuthValidation.loginValidationSchema.safeParse(body);

  if (!validationResult.success) {
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

const changePassword = catchAsync(async (req: Request) => {
  const user = await authGuard(["ADMIN", "GUIDE", "TOURIST"]);
  const body = await req.json();

  const validation = AuthValidation.changePasswordSchema.safeParse(body);
  if (!validation.success) throw new AppError(StatusCodes.BAD_REQUEST, "Validation Error");

  const result = await AuthService.changePassword(user.id, validation.data);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request) => {
  const body = await req.json();
  const result = await AuthService.forgotPassword(body.email);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reset link sent",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request) => {
  const body = await req.json();
  const result = await AuthService.resetPassword(body.token, body.newPassword);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});


// ✅ NEW: Get Me Controller
const getMe = catchAsync(async (req: Request) => {
  // Token check (Allow all roles)
  const user = await authGuard(["ADMIN", "GUIDE", "TOURIST"]);

  const result = await AuthService.getMe(user.id);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

export const AuthController = {
  register,
  verify,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
};