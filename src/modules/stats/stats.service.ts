import { prisma } from "@/lib/prisma";
import { Role, BookingStatus, PaymentStatus } from "@prisma/client";

const getDashboardStats = async (userId: string, role: string) => {
  let stats: any = {};

  // --- 1. ADMIN STATS ---
  if (role === Role.ADMIN) {
    const totalUsers = await prisma.user.count();
    const totalListings = await prisma.listing.count();
    const totalBookings = await prisma.booking.count();
    
    const revenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.COMPLETED }
    });

    // Calculate Monthly Revenue for Last 6 Months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payments = await prisma.payment.findMany({
      where: {
        status: PaymentStatus.COMPLETED,
        createdAt: { gte: sixMonthsAgo },
      },
      select: { amount: true, createdAt: true },
    });

    // Group by Month
    const monthlyData = payments.reduce((acc: any, payment) => {
      const month = payment.createdAt.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {});

    // Format for Recharts
    const chartData = Object.keys(monthlyData).map(key => ({
      name: key,
      total: monthlyData[key]
    }));

    stats = {
      totalUsers,
      totalListings,
      totalBookings,
      totalRevenue: revenue._sum.amount || 0,
      monthlyStats: chartData,
    };
  }

  // --- 2. GUIDE STATS ---
  else if (role === Role.GUIDE) {
    const totalListings = await prisma.listing.count({ where: { guideId: userId } });
    const totalBookings = await prisma.booking.count({ where: { guideId: userId } });

    const earnings = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { booking: { guideId: userId }, status: PaymentStatus.COMPLETED }
    });

    const activeBookings = await prisma.booking.count({
      where: { guideId: userId, status: BookingStatus.PENDING }
    });

    // ✅ NEW: Monthly Earnings for Guide (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payments = await prisma.payment.findMany({
      where: {
        booking: { guideId: userId },
        status: PaymentStatus.COMPLETED,
        createdAt: { gte: sixMonthsAgo },
      },
      select: { amount: true, createdAt: true },
    });

    // Group by Month
    const monthlyData = payments.reduce((acc: any, payment) => {
      const month = payment.createdAt.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {});

    // Format for Recharts
    const chartData = Object.keys(monthlyData).map(key => ({
      name: key,
      total: monthlyData[key]
    }));

    stats = {
      totalListings,
      totalBookings,
      totalEarnings: earnings._sum.amount || 0,
      activeBookings,
      monthlyStats: chartData, // ✅ Guide Dashboard এও chart দেখাবে
    };
  }

  // --- 3. TOURIST STATS ---
  else if (role === Role.TOURIST) {
    const totalTrips = await prisma.booking.count({
      where: { touristId: userId, status: BookingStatus.CONFIRMED }
    });
    const totalSpent = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { booking: { touristId: userId }, status: PaymentStatus.COMPLETED }
    });
    const pendingBookings = await prisma.booking.count({
      where: { touristId: userId, status: BookingStatus.PENDING }
    });

    // ✅ NEW: Monthly Spending for Tourist (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payments = await prisma.payment.findMany({
      where: {
        booking: { touristId: userId },
        status: PaymentStatus.COMPLETED,
        createdAt: { gte: sixMonthsAgo },
      },
      select: { amount: true, createdAt: true },
    });

    // Group by Month
    const monthlyData = payments.reduce((acc: any, payment) => {
      const month = payment.createdAt.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {});

    // Format for Recharts
    const chartData = Object.keys(monthlyData).map(key => ({
      name: key,
      total: monthlyData[key]
    }));

    stats = { 
      totalTrips, 
      totalSpent: totalSpent._sum.amount || 0, 
      pendingBookings,
      monthlyStats: chartData, // ✅ Tourist Dashboard এও chart দেখাবে
    };
  }

  return stats;
};

export const StatsService = {
  getDashboardStats,
};