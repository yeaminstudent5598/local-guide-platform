import { cookies, headers } from "next/headers";
import { verifyToken, CustomJWTPayload } from "@/lib/jwt";
import AppError from "./AppError";
import { StatusCodes } from "http-status-codes";

export const authGuard = async (allowedRoles?: string[]): Promise<CustomJWTPayload> => {
  let token: string | undefined;

  // 1. Try to get token from Authorization Header (Frontend & Postman)
  const headersList = await headers();
  const authHeader = headersList.get("authorization");
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. If no header, try to get from Cookies (Server Components/Middleware)
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("accessToken")?.value;
  }

  // 3. If still no token found, throw error
  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }

  // 4. Verify Token
  const decoded = verifyToken(token);

  if (!decoded) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired token");
  }

  // 5. Check Role Permission
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(decoded.role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You don't have permission to perform this action"
      );
    }
  }

  return decoded;
};