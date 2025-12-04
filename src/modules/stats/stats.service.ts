import { prisma } from "@/lib/prisma";
import { Role, BookingStatus, PaymentStatus } from "@prisma/client";

const getDashboardStats = async (userId: string, role: string) => {
  let stats = {};

  // 1. TOURIST STATS
  if (role === Role.TOURIST) {
    // A. Total Trips (Status = CONFIRMED or COMPLETED)
    const totalTrips = await prisma.booking.count({
      where: { 
        touristId: userId, 
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] } 
      }
    });

    // B. Total Spent (Sum from Payment Table)
    const totalSpent = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { 
        booking: { touristId: userId }, // Relation filter
        status: PaymentStatus.COMPLETED 
      }
    });

    // C. Pending Bookings
    const pendingBookings = await prisma.booking.count({
      where: { touristId: userId, status: BookingStatus.PENDING }
    });

    stats = {
      totalTrips,
      totalSpent: totalSpent._sum.amount || 0,
      pendingBookings
    };
  }

  // 2. GUIDE STATS
  else if (role === Role.GUIDE) {
    const totalListings = await prisma.listing.count({
      where: { guideId: userId }
    });
    
    // Total Bookings (All time)
    const totalBookings = await prisma.booking.count({
      where: { guideId: userId }
    });

    // Earnings (From Payment Table -> Booking -> Guide)
    const earnings = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { 
        booking: { guideId: userId },
        status: PaymentStatus.COMPLETED 
      }
    });

    // Pending Requests
    const activeBookings = await prisma.booking.count({
      where: { guideId: userId, status: BookingStatus.PENDING }
    });

    stats = {
      totalListings,
      totalBookings,
      totalEarnings: earnings._sum.amount || 0,
      activeBookings
    };
  }

  // 3. ADMIN STATS
  else if (role === Role.ADMIN) {
    const totalUsers = await prisma.user.count();
    const totalListings = await prisma.listing.count();
    const totalBookings = await prisma.booking.count();
    
    const revenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.COMPLETED }
    });

    stats = {
      totalUsers,
      totalListings,
      totalBookings,
      totalRevenue: revenue._sum.amount || 0,
    };
  }

  return stats;
};

export const StatsService = {
  getDashboardStats,
};