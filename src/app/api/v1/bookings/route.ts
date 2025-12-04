import { BookingController } from "@/modules/bookings/booking.controller";

export const GET = BookingController.getBookings;
export const POST = BookingController.createBooking;