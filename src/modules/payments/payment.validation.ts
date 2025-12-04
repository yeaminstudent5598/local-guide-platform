import { z } from "zod";

const createPaymentIntentSchema = z.object({
  bookingId: z.string({ required_error: "Booking ID is required" }),
});

const confirmPaymentSchema = z.object({
  paymentIntentId: z.string({ required_error: "Payment Intent ID is required" }),
});

export const PaymentValidation = {
  createPaymentIntentSchema,
  confirmPaymentSchema,
};