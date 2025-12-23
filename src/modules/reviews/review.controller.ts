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


// ✅ NEW: Get My Reviews Controller
const getMyReviews = catchAsync(async (req: Request) => {
  const user = await authGuard(["ADMIN", "GUIDE", "TOURIST"]);
  
  const result = await ReviewService.getMyReviews(user.id, user.role);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result,
  });
});


const getGuideReviews = catchAsync(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    if (!id) {
      return sendResponse({
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: "Guide ID is required",
        data: null,
      });
    }

    const result = await ReviewService.getGuideReviews(id);

    return sendResponse({
      statusCode: StatusCodes.OK,
      success: true,
      message: "Guide reviews retrieved successfully",
      data: result,
    });
  }
);

// ✅ NEW: Get Guide Rating
const getGuideRating = catchAsync(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    if (!id) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Guide ID is required");
    }

    const result = await ReviewService.getGuideRating(id);

    // Always return the rating stats (0 if no reviews)
    return sendResponse({
      statusCode: StatusCodes.OK,
      success: true,
      message: "Guide rating retrieved successfully",
      data: result, // { average: 0, count: 0 } if no reviews
    });
  }
);



export const ReviewController = {
  createReview,
  getListingReviews,
  getMyReviews,
  getGuideReviews,
  getGuideRating,
};