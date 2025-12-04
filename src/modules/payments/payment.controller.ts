import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { PaymentService } from "./payment.service";
import { authGuard } from "@/utils/authGuard";
import { NextResponse } from "next/server"; // ✅ Import NextResponse

// Init Payment
const initPayment = catchAsync(async (req: Request) => {
  const user = await authGuard(["TOURIST"]);
  const body = await req.json();

  const gatewayUrl = await PaymentService.initPayment(body.bookingId, user.id);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment initialized",
    data: { url: gatewayUrl },
  });
});

// Handle Success (Updated) ✅
const handleSuccess = catchAsync(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");
  const tranId = searchParams.get("tranId");

  await PaymentService.validatePayment({ bookingId, tranId });

  // ✅ Change: Redirect to dedicated success page
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_API_URL}/payment/success?tranId=${tranId}`,
    { status: 303 }
  );
});


// Handle Fail / Cancel
const handleFail = catchAsync(async (req: Request) => {
  // ✅ Update: Redirect to the new dedicated Fail Page
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_API_URL}/payment/fail`, 
    { status: 303 }
  );
});

export const PaymentController = {
  initPayment,
  handleSuccess,
  handleFail
};