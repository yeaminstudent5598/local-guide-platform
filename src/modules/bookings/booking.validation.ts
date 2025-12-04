import { z } from "zod";

const createBookingSchema = z.object({
  listingId: z.string({ required_error: "Listing ID is required" }),
  bookingDate: z.string({ required_error: "Date is required" }), // Frontend থেকে Date string আসবে
  numberOfPeople: z.number().int().positive().min(1, "At least 1 person required"),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "REJECTED", "COMPLETED"]),
});

export const BookingValidation = {
  createBookingSchema,
  updateBookingStatusSchema,
};