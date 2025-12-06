import { prisma } from "@/lib/prisma";

// 1. Create Review
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createReview = async (payload: any, userId: string) => {
  // Check if listing exists
  const listing = await prisma.listing.findUnique({
    where: { id: payload.listingId },
  });

  if (!listing) throw new Error("Listing not found");

  // Create Review with 'connect' syntax
  const result = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      
      // ✅ FIX: Use 'connect' instead of direct ID assignment
      listing: {
        connect: { id: payload.listingId }
      },
      user: {
        connect: { id: userId }
      },
      guide: {
        connect: { id: listing.guideId }
      },
      
      // ⚠️ Note: If 'bookingId' is mandatory in your schema, 
      // you must either provide it or make it optional in schema.
    },
  });

  return result;
};

// 2. Get Reviews (✅ FIXED)
const getReviewsByListing = async (listingId: string) => {
  const result = await prisma.review.findMany({
    where: { listingId },
    include: {
      user: {
        select: {
          name: true,
          profileImage: true,
        },
      },
      // ✅ এই part টা missing ছিল
      listing: {
        select: {
          title: true,
          city: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};


// ✅ 1. Get Reviews for a specific Guide
const getGuideReviews = async (guideId: string) => {
  const result = await prisma.review.findMany({
    where: { guideId },
    include: {
      user: {
        select: {
          name: true,
          profileImage: true,
        },
      },
      listing: {
        select: {
          title: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// ✅ 2. Get Guide Stats (Average Rating & Count)
const getGuideRating = async (guideId: string) => {
  const aggregations = await prisma.review.aggregate({
    where: { guideId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    average: aggregations._avg.rating || 0,
    count: aggregations._count.rating || 0,
  };
};


// ✅ NEW: Get My Reviews (Dashboard)
const getMyReviews = async (userId: string, role: string) => {
  let whereCondition = {};

  if (role === "TOURIST") {
    whereCondition = { userId }; // Reviews written by me
  } else if (role === "GUIDE") {
    whereCondition = { guideId: userId }; // Reviews received by me
  } 
  // Admin sees all

  const result = await prisma.review.findMany({
    where: whereCondition,
    include: {
      listing: {
        select: { title: true, images: true }
      },
      user: { // Reviewer info
        select: { name: true, profileImage: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return result;
};


export const ReviewService = {
  createReview,
  getReviewsByListing,
  // New Exports
  getGuideReviews,
  getGuideRating,
  getMyReviews,
};