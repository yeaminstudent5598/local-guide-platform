import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ILoginUser, IRegisterUser } from "./auth.validation"; // Importing types from validation
import AppError from "@/utils/AppError";
import { StatusCodes } from "http-status-codes";
import { signJwtAccessToken } from "@/lib/jwt";

const registerUser = async (payload: IRegisterUser) => {
  // Check if user exists
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new AppError(StatusCodes.CONFLICT, "User with this email already exists!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // Create user
  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  // Remove password from response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userData } = result;
  
  return userData;
};

const loginUser = async (payload: ILoginUser) => {
  // Check user existence
  const userData = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exist!");
  }

  // Check password
  const isPasswordMatched = await bcrypt.compare(payload.password, userData.password);

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Incorrect password!");
  }

  // Generate Token
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = userData;
  const accessToken = signJwtAccessToken(userWithoutPassword);

  return {
    accessToken,
    user: userWithoutPassword,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};