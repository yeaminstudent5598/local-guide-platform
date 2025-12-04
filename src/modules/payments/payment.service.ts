import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import AppError from "@/utils/AppError";
import { StatusCodes } from "http-status-codes";

// 1. Configuration
const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASS;
const is_live = false; 

const sslcz_api = is_live
  ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
  : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

// 2. Initialize Payment
const initPayment = async (bookingId: string, userId: string) => {
  // A. Check Credentials
  if (!store_id || !store_passwd) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Payment Gateway Config Missing");
  }

  // B. Fetch Booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tourist: true, listing: true }
  });

  if (!booking) {
    throw new AppError(StatusCodes.NOT_FOUND, "Booking not found");
  }

  if (booking.touristId !== userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
  }

  // C. Prepare Data
  const tran_id = `TXN-${Date.now()}`;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const data = new URLSearchParams();
  data.append("store_id", store_id);
  data.append("store_passwd", store_passwd);
  data.append("total_amount", booking.totalAmount.toString());
  data.append("currency", "BDT");
  data.append("tran_id", tran_id);
  data.append("success_url", `${baseUrl}/api/v1/payments/success?bookingId=${bookingId}&tranId=${tran_id}`);
  data.append("fail_url", `${baseUrl}/api/v1/payments/fail?bookingId=${bookingId}`);
  data.append("cancel_url", `${baseUrl}/api/v1/payments/cancel`);
  data.append("ipn_url", `${baseUrl}/api/v1/payments/ipn`);
  data.append("shipping_method", "NO");
  data.append("product_name", booking.listing.title);
  data.append("product_category", "Tourism");
  data.append("product_profile", "general");
  data.append("cus_name", booking.tourist.name || "Customer");
  data.append("cus_email", booking.tourist.email || "customer@example.com");
  data.append("cus_add1", "Dhaka");
  data.append("cus_city", "Dhaka");
  data.append("cus_country", "Bangladesh");
  data.append("cus_phone", "01711111111");

  try {
    const response = await fetch(sslcz_api, {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (result.status === "SUCCESS") {
      return result.GatewayPageURL;
    } else {
      throw new Error("Failed to init payment");
    }
  } catch (error) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Payment Gateway Error");
  }
};

// 3. Validate Payment (Fixed Amount Issue)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePayment = async (payload: any) => {
  const { bookingId, tranId } = payload;

  if (!bookingId || !tranId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Payment Data");
  }

  const result = await prisma.$transaction(async (tx) => {
    // A. Check if already processed
    const existing = await tx.payment.findUnique({
      where: { transactionId: tranId }
    });
    if (existing) return existing;

    // B. Fetch Booking to get REAL Amount ✅ (NEW ADDITION)
    const booking = await tx.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) throw new Error("Booking record not found during payment validation");

    // C. Create Payment Record with Correct Amount
    const payment = await tx.payment.create({
      data: {
        amount: booking.totalAmount, // ✅ Fixed: Using real amount from DB
        currency: "BDT",
        status: PaymentStatus.COMPLETED,
        transactionId: tranId,
        bookingId: bookingId,
      }
    });

    // D. Update Booking Status
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CONFIRMED }
    });

    return payment;
  });

  return result;
};

export const PaymentService = {
  initPayment,
  validatePayment,
};