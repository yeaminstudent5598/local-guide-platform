import { z } from "zod";

const createListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  itinerary: z.string().optional(),
  tourFee: z.number().positive("Fee must be a positive number"),
  duration: z.number().int().positive("Duration must be a positive integer"),
  maxGroupSize: z.number().int().positive(),
  meetingPoint: z.string().min(3),
  city: z.string().min(2),
  country: z.string().min(2),
  category: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

const updateListingSchema = createListingSchema.partial(); // সব ফিল্ড অপশনাল হয়ে যাবে আপডেটের সময়

export const ListingValidation = {
  createListingSchema,
  updateListingSchema,
};