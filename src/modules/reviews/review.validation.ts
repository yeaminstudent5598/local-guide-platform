import { z } from "zod";

const createReviewSchema = z.object({
  listingId: z.string({ required_error: "Listing ID is required" }),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(5, "Comment must be at least 5 characters long"),
});

export const ReviewValidation = {
  createReviewSchema,
};