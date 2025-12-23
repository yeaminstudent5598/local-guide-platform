import { NextResponse } from "next/server";
import catchAsync from "@/utils/catchAsync";
import { authGuard } from "@/utils/authGuard";
import { prisma } from "@/lib/prisma";

export const GET = catchAsync(async (req: Request, { params }: { params: Promise<{ listingId: string }> }) => {
  const user = await authGuard();
  
  // Unwrap params for Next.js 15
  const { listingId } = await params;

  // Check if the ID exists in either listingId or guideId column
  const wishlistEntry = await prisma.wishlist.findFirst({
    where: {
      userId: user.id,
      OR: [
        { listingId: listingId },
        { guideId: listingId }
      ]
    },
  });

  return NextResponse.json({
    success: true,
    data: !!wishlistEntry,
  });
});