import { z } from "zod";

const createBookingSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  bookingDate: z.string().min(1, "Date is required"), // Frontend থেকে date string আসবে
  numberOfPeople: z
    .number()
    .int()
    .positive()
    .min(1, "At least 1 person required"),
});

// ✅ এখানে ACCEPTED add করলাম
const updateBookingStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "CONFIRMED", "CANCELLED", "REJECTED", "COMPLETED"]),
});

export const BookingValidation = {
  createBookingSchema,
  updateBookingStatusSchema,
};