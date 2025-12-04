import { prisma } from "@/lib/prisma";
import { BookingStatus, Role } from "@prisma/client";

// 1. Create Booking (Tourist Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBooking = async (payload: any, userId: string) => {
  // A. Listing খুঁজে বের করা
  const listing = await prisma.listing.findUnique({
    where: { id: payload.listingId },
  });

  if (!listing) throw new Error("Listing not found");
  
  // B. নিজের ট্যুর নিজে বুক করা যাবে না (Optional validation)
  if (listing.guideId === userId) {
    throw new Error("You cannot book your own tour");
  }

  const totalAmount = listing.tourFee * payload.numberOfPeople;

  // C. Booking তৈরি (সবচেয়ে গুরুত্বপূর্ণ ধাপ)
  const result = await prisma.booking.create({
    data: {
      bookingDate: new Date(payload.bookingDate),
      numberOfPeople: payload.numberOfPeople,
      totalAmount: totalAmount,
      listingId: payload.listingId,
      touristId: userId,
      
      // ⚠️ CRITICAL FIX: লিস্টিং থেকে Guide ID নিয়ে এখানে বসাচ্ছি
      guideId: listing.guideId, 
      
      status: "PENDING",
    },
  });

  return result;
};

// 2. Get All Bookings (Guide, Tourist, Admin)
// ... imports

const getAllBookings = async (userId: string, role: string) => {
  console.log("🔍 Debugging Bookings Fetch:");
  console.log("👉 User ID:", userId);
  console.log("👉 Role:", role);

  const whereCondition: any = {};

  if (role === Role.TOURIST) {
    whereCondition.touristId = userId;
  } else if (role === Role.GUIDE) {
    whereCondition.guideId = userId;
  }

  console.log("👉 Query Condition:", JSON.stringify(whereCondition, null, 2));

  const result = await prisma.booking.findMany({
    where: whereCondition,
    include: {
      listing: { select: { title: true, city: true } },
      tourist: { select: { name: true, email: true } },
      guide: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  console.log("👉 Found Data Count:", result.length); // এটা কি ০ দেখাচ্ছে?

  return result;
};

// 3. Update Status
const updateBookingStatus = async (bookingId: string, status: BookingStatus, userId: string, role: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error("Booking not found");

  // Authorization Check
  if (role === Role.GUIDE && booking.guideId !== userId) {
    throw new Error("You are not authorized to manage this booking");
  }
  
  if (role === Role.TOURIST && booking.touristId !== userId) {
    throw new Error("You are not authorized to manage this booking");
  }

  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  return result;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
};