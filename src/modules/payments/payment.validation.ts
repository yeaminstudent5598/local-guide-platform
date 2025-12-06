import { z } from "zod";

const createPaymentIntentSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});

const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, "Payment Intent ID is required"),
});

export const PaymentValidation = {
  createPaymentIntentSchema,
  confirmPaymentSchema,
};