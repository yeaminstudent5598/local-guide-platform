import { prisma } from "@/lib/prisma";

// 1. Toggle Wishlist (Add/Remove)
const toggleWishlist = async (userId: string, listingId: string) => {
  // Check if listing exists
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) throw new Error("Listing not found");

  // Check if already in wishlist
  const existingItem = await prisma.wishlist.findUnique({
    where: {
      userId_listingId: {
        userId,
        listingId,
      },
    },
  });

  if (existingItem) {
    // Remove
    await prisma.wishlist.delete({
      where: { id: existingItem.id },
    });
    return { message: "Removed from wishlist", added: false };
  } else {
    // Add
    await prisma.wishlist.create({
      data: {
        userId,
        listingId,
      },
    });
    return { message: "Added to wishlist", added: true };
  }
};

// 2. Get My Wishlist (Fixed)
const getMyWishlist = async (userId: string) => {
  const result = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          city: true,
          country: true,
          tourFee: true,
          images: true,
          duration: true,
          // ❌ rating: true, (এটা বাদ দিন কারণ স্কিমাতে এটা নেই)
          
          // ✅ reviews থেকে rating নিন
          reviews: {
            select: {
              rating: true
            }
          }
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

export const WishlistService = {
  toggleWishlist,
  getMyWishlist,
};