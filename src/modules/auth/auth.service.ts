import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ILoginUser, IRegisterUser } from "./auth.validation";
import AppError from "@/utils/AppError";
import { StatusCodes } from "http-status-codes";
import redis from "@/lib/redis"; // ✅ Added Redis
import { sendEmail } from "@/lib/email"; // ✅ Added Nodemailer
import { signToken } from "@/lib/jwt";

// Helper: Generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. REGISTER (Updated with OTP)
const registerUser = async (payload: IRegisterUser) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    // If user exists but not verified, resend OTP
    if (!existingUser.isVerified) {
      const otp = generateOTP();
      await redis.set(`otp:${payload.email}`, otp, "EX", 300); // 5 mins expiry
      
      await sendEmail(
        payload.email,
        "Verify your Account - Vistara",
        `<h3>Your Verification Code is: <b style="color: #2563EB; font-size: 24px;">${otp}</b></h3><p>This code expires in 5 minutes.</p>`
      );
      
      return { message: "Account exists but unverified. OTP resent.", email: payload.email };
    }
    throw new AppError(StatusCodes.CONFLICT, "User with this email already exists!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // Create user (Unverified)
  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      isVerified: false, // Default false
    },
  });

  // Generate & Save OTP
  const otp = generateOTP();
  await redis.set(`otp:${newUser.email}`, otp, "EX", 300);

  // Send Email
  await sendEmail(
    newUser.email,
    "Verify your Account - Vistara",
    `<h3>Welcome to Vistara!</h3><p>Your Verification Code is: <b style="color: #2563EB; font-size: 24px;">${otp}</b></p><p>This code expires in 5 minutes.</p>`
  );

  return { 
    id: newUser.id, 
    email: newUser.email, 
    message: "OTP sent to your email. Please verify." 
  };
};

// 2. VERIFY OTP (New Function)
const verifyOtp = async (email: string, otp: string) => {
  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP expired or invalid");
  }

  if (storedOtp !== otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect OTP");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  // Update Status
  await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });

  await redis.del(`otp:${email}`);

  // Auto Login (Generate Token)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  const accessToken = signToken(userWithoutPassword);

  return { accessToken, user: userWithoutPassword };
};

// 3. LOGIN (Updated: Check isVerified)
const loginUser = async (payload: ILoginUser) => {
  const userData = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exist!");
  }

  // Check verification status
  if (!userData.isVerified) {
    throw new AppError(StatusCodes.FORBIDDEN, "Please verify your email first!");
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, userData.password);

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Incorrect password!");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = userData;
  const accessToken = signToken(userWithoutPassword);

  return {
    accessToken,
    user: userWithoutPassword,
  };
};

// 4. Change Password Service (Authenticated)
const changePassword = async (userId: string, payload: any) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isMatch) throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect old password");

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
};

// 5. Forgot Password Service (Generates Link)
const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  // Generate Token
  const resetToken = signToken({ id: user.id, email: user.email, role: user.role });

  // ⚠️ Send Email using Nodemailer
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  
  await sendEmail(
    email,
    "Reset Password - Vistara",
    `<h3>Click the link to reset password:</h3><a href="${resetLink}">Reset Password</a>`
  );

  return { message: "Reset link sent to your email" };
};

// 6. Reset Password Service
const resetPassword = async (token: string, newPassword: string) => {
  const decoded: any = signToken(token as any); // Just placeholder, use verify logic
  
  if (!decoded) throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired token");

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: decoded.id },
    data: { password: hashedPassword },
  });

  return { message: "Password reset successfully" };
};

// ✅ 7. Get Current Logged In User
const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};


export const AuthService = {
  registerUser,
  verifyOtp,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
};