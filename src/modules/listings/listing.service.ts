import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary";

// 1. Create Listing
const createListing = async (payload: any, userId: string) => {
  const result = await prisma.listing.create({
    data: {
      ...payload,
      guideId: userId,
      isActive: true, // ✅ Default value দিলাম
    },
    include: {
      guide: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          bio: true,
        },
      },
    },
  });
  return result;
};

// 2. Get All Listings (Search & Filter)
const getAllListings = async (query: Record<string, unknown>) => {
  const { searchTerm, city, minPrice, maxPrice } = query;

  const andConditions: Prisma.ListingWhereInput[] = [];

  // A. Search Logic (Title, City, Description)
  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm as string, mode: "insensitive" } },
        { city: { contains: searchTerm as string, mode: "insensitive" } },
        { description: { contains: searchTerm as string, mode: "insensitive" } },
      ],
    });
  }

  // B. Exact Filter by City
  if (city) {
    andConditions.push({
      city: { equals: city as string, mode: "insensitive" },
    });
  }

  // C. Price Range Filter
  if (minPrice || maxPrice) {
    andConditions.push({
      tourFee: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
    });
  }

  // D. Default: Only Active Listings
  andConditions.push({ isActive: true });

  const whereConditions: Prisma.ListingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : { isActive: true };

  const result = await prisma.listing.findMany({
    where: whereConditions,
    include: {
      guide: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          email: true,
          isVerified: true,
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// 3. Get Single Listing
const getSingleListing = async (id: string) => {
  const result = await prisma.listing.findUnique({
    where: { id },
    include: {
      guide: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          bio: true,
          languages: true,
          expertise: true,
          isVerified: true,
          createdAt: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });
  return result;
};

// 4. Update Listing (Only Owner)
const updateListing = async (id: string, payload: any, userId: string) => {
  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) {
    throw new Error("Listing not found");
  }
  
  if (listing.guideId !== userId) {
    throw new Error("You are not authorized to edit this listing");
  }

  const result = await prisma.listing.update({
    where: { id },
    data: payload,
    include: {
      guide: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });
  return result;
};

// 5. Delete Listing (With Cloudinary Image Cleanup)
const deleteListing = async (id: string, userId: string, userRole: string) => {
  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) {
    throw new Error("Listing not found");
  }
  
  // ✅ FIX: Logic Update
  if (userRole !== "ADMIN" && listing.guideId !== userId) {
    throw new Error("You are not authorized to delete this listing");
  }

  // Delete images from Cloudinary
  if (listing.images && listing.images.length > 0) {
    try {
      await Promise.all(
        listing.images.map(async (imageUrl) => {
          const publicId = getPublicIdFromUrl(imageUrl);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        })
      );
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
    }
  }

  // Delete from Database
  const result = await prisma.listing.delete({
    where: { id },
  });
  return result;
};

// 6. Get Listings by Guide ID
const getListingsByGuideId = async (guideId: string) => {
  const result = await prisma.listing.findMany({
    where: { guideId },
    include: {
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// 7. Toggle Listing Status (Active/Inactive)
const toggleListingStatus = async (id: string, userId: string) => {
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { guideId: true, isActive: true },
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (listing.guideId !== userId) {
    throw new Error("You are not authorized to update this listing");
  }

  const result = await prisma.listing.update({
    where: { id },
    data: { isActive: !listing.isActive },
  });

  return result;
};

// ✅ NEW: Get All Listings For Admin (No filters, includes Inactive)
const getAllListingsForAdmin = async () => {
  const result = await prisma.listing.findMany({
    include: {
      guide: {
        select: {
          name: true,
          email: true,
          profileImage: true,
        },
      },
      _count: {
        select: { bookings: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};


// ✅ NEW: Get Featured Listings (Top 6 Active)
const getFeaturedListings = async () => {
  const result = await prisma.listing.findMany({
    where: {
      isActive: true, // শুধুমাত্র অ্যাক্টিভ ট্যুর
    },
    take: 6, // মাত্র ৬টি দেখাবো
    orderBy: {
      createdAt: "desc", // লেটেস্ট আগে (অথবা reviews count দিয়ে সর্ট করতে পারেন)
    },
    include: {
      guide: {
        select: {
          name: true,
          profileImage: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });
  return result;
};


export const ListingService = {
  createListing,
  getAllListings,
  getSingleListing,
  updateListing,
  deleteListing,
  getListingsByGuideId,
  toggleListingStatus,
  getAllListingsForAdmin,
  getFeaturedListings,
};