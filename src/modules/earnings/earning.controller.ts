import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { EarningService } from "./earning.service";
import { authGuard } from "@/utils/authGuard";

const getEarnings = catchAsync(async (req: Request) => {
  // 1. Check Auth (Only Guide/Admin)
  const user = await authGuard(["GUIDE", "ADMIN"]);

  // 2. Call Service
  const result = await EarningService.getMyEarnings(user.id, user.role);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Earnings data retrieved successfully",
    data: result,
  });
});

export const EarningController = {
  getEarnings,
};