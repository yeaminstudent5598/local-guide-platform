import { verifyJwt } from "@/lib/jwt";
import AppError from "./AppError";
import { StatusCodes } from "http-status-codes";
import { headers } from "next/headers";

export const authGuard = async (requiredRoles: string[]) => {
  const headersList = await headers();
  const token = headersList.get("authorization")?.split(" ")[1];

  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  }

  const decoded = verifyJwt(token);

  if (!decoded) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid Token!");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (decoded as any).role;

  if (requiredRoles.length && !requiredRoles.includes(role)) {
    throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to access this resource!");
  }

  return decoded;
};