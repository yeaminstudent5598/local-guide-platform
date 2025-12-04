import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { BookingService } from "./booking.service";
import { BookingValidation } from "./booking.validation";
import { authGuard } from "@/utils/authGuard";
import AppError from "@/utils/AppError";

// Create Booking
const createBooking = catchAsync(async (req: Request) => {
  const user = await authGuard(["TOURIST"]); // Only Tourist can book
  const body = await req.json();

  const validation = BookingValidation.createBookingSchema.safeParse(body);
  if (!validation.success) {
    const errorMessage = validation.error.issues.map(e => e.message).join(", ");
    throw new AppError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  const result = await BookingService.createBooking(validation.data, user.id);

  return sendResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Booking request sent successfully",
    data: result,
  });
});

// Get All Bookings
const getBookings = catchAsync(async (req: Request) => {
  const user = await authGuard(["TOURIST", "GUIDE", "ADMIN"]);
  
  const result = await BookingService.getAllBookings(user.id, user.role);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

// Update Status (Accept/Reject/Cancel)
const updateStatus = catchAsync(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await authGuard(["GUIDE", "TOURIST", "ADMIN"]);
  const { id } = await params;
  const body = await req.json();

  const validation = BookingValidation.updateBookingStatusSchema.safeParse(body);
  if (!validation.success) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid status");
  }

  const result = await BookingService.updateBookingStatus(id, validation.data.status, user.id, user.role);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Booking status updated successfully",
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getBookings,
  updateStatus,
};