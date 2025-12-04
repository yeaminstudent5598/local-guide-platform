import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { WishlistService } from "./wishlist.service";
import { authGuard } from "@/utils/authGuard";
import AppError from "@/utils/AppError";

// Toggle Wishlist
const toggleWishlist = catchAsync(async (req: Request) => {
  const user = await authGuard(["TOURIST"]);
  const body = await req.json();

  if (!body.listingId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Listing ID is required");
  }

  const result = await WishlistService.toggleWishlist(user.id, body.listingId);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

// Get Wishlist
const getWishlist = catchAsync(async (req: Request) => {
  const user = await authGuard(["TOURIST"]);
  const result = await WishlistService.getMyWishlist(user.id);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Wishlist retrieved successfully",
    data: result,
  });
});

export const WishlistController = {
  toggleWishlist,
  getWishlist,
};