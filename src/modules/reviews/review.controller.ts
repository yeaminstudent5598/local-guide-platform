import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ReviewService } from "./review.service";
import { ReviewValidation } from "./review.validation";
import { authGuard } from "@/utils/authGuard";
import AppError from "@/utils/AppError";

// Create Review (Tourist Only)
const createReview = catchAsync(async (req: Request) => {
  const user = await authGuard(["TOURIST"]); // Only Tourist can review
  const body = await req.json();

  const validation = ReviewValidation.createReviewSchema.safeParse(body);
  if (!validation.success) {
    const errorMessage = validation.error.issues.map(e => e.message).join(", ");
    throw new AppError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  const result = await ReviewService.createReview(validation.data, user.id);

  return sendResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Review submitted successfully",
    data: result,
  });
});

// Get Listing Reviews (Public)
const getListingReviews = catchAsync(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params; // listingId
  const result = await ReviewService.getReviewsByListing(id);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getListingReviews,
};