import { prisma } from "@/lib/prisma";
import AppError from "@/utils/AppError";
import { StatusCodes } from "http-status-codes";

export const toggleWishlistInDB = async (userId: string, targetId: string) => {
  // 1. Check if the target is a Listing
  const isListing = await prisma.listing.findUnique({
    where: { id: targetId },
  });

  // 2. Build the where condition dynamically to find existing record
  // We use findFirst because we are checking across two different potential columns
  const existing = await prisma.wishlist.findFirst({
    where: {
      userId: userId,
      OR: [
        { listingId: targetId },
        { guideId: targetId }
      ]
    },
  });

  if (existing) {
    // 3. If it exists, delete it (Toggle Off)
    await prisma.wishlist.delete({
      where: { id: existing.id },
    });
    return { isWishlisted: false, message: "Removed from wishlist" };
  } else {
    // 4. If it doesn't exist, create it (Toggle On)
    // We use a clean object construction to satisfy Prisma's strict types
    if (isListing) {
      await prisma.wishlist.create({
        data: {
          userId: userId,
          listingId: targetId,
        },
      });
    } else {
      // Validate that the targetId belongs to a valid GUIDE before creating
      const guideExists = await prisma.user.findUnique({
        where: { id: targetId, role: "GUIDE" },
      });

      if (!guideExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "Tour or Guide not found");
      }

      await prisma.wishlist.create({
        data: {
          userId: userId,
          guideId: targetId,
        },
      });
    }

    return { isWishlisted: true, message: "Added to wishlist" };
  }
};