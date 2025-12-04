import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { StatsService } from "./stats.service";
import { authGuard } from "@/utils/authGuard";

const getStats = catchAsync(async (req: Request) => {
  const user = await authGuard(["ADMIN", "GUIDE", "TOURIST"]);

  const result = await StatsService.getDashboardStats(user.id, user.role);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});

export const StatsController = {
  getStats,
};