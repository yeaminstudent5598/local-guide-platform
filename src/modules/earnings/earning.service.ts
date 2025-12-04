import { prisma } from "@/lib/prisma";
import { PaymentStatus, Role } from "@prisma/client";

const getMyEarnings = async (userId: string, role: string) => {
  // শুধুমাত্র গাইড এবং অ্যাডমিন তাদের আর্নিং দেখতে পারবে
  if (role !== Role.GUIDE && role !== Role.ADMIN) {
    throw new Error("Unauthorized access to earnings");
  }

  // 1. Fetch Completed Payments for this Guide
  const earnings = await prisma.payment.findMany({
    where: {
      booking: {
        guideId: userId, // Match Guide ID
      },
      status: PaymentStatus.COMPLETED,
    },
    include: {
      booking: {
        select: {
          bookingDate: true,
          tourist: {
            select: { name: true, email: true }
          },
          listing: {
            select: { title: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Calculate Total Earnings
  const totalEarnings = earnings.reduce((acc, curr) => acc + curr.amount, 0);

  // 3. Calculate Pending Payout (Optional Logic: e.g., payments < 7 days old)
  const pendingPayout = 0; // আপাতত ০ রাখলাম, পরে লজিক বসাতে পারেন

  return {
    history: earnings,
    total: totalEarnings,
    pending: pendingPayout
  };
};

export const EarningService = {
  getMyEarnings,
};