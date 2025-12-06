import { ReviewController } from "@/modules/reviews/review.controller";

export const GET = ReviewController.getMyReviews;
export const POST = ReviewController.createReview;