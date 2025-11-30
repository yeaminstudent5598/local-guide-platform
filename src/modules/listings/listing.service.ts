import { prisma } from "@/lib/prisma";
import { Listing, Prisma } from "@prisma/client";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary";

// 1. Create Listing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createListing = async (payload: any, userId: string) => {
  const result = await prisma.listing.create({
    data: {
      ...payload,
      guideId: userId, // User ID from token
    },
  });
  return result;
};

// 2. Get All Listings (Search & Filter)
const getAllListings = async (query: Record<string, unknown>) => {
  const { searchTerm, city, minPrice, maxPrice, ...filterData } = query;

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
          name: true,
          profileImage: true,
          email: true,
        },
      },
      reviews: true,
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
          createdAt: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: { name: true, profileImage: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return result;
};

// 4. Update Listing (Only Owner)
const updateListing = async (id: string, payload: Partial<Listing>, userId: string) => {
  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) throw new Error("Listing not found");
  if (listing.guideId !== userId) throw new Error("You are not authorized to edit this listing");

  const result = await prisma.listing.update({
    where: { id },
    data: payload,
  });
  return result;
};

// 5. Delete Listing (With Cloudinary Image Cleanup) ⚠️ Important
const deleteListing = async (id: string, userId: string) => {
  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) throw new Error("Listing not found");
  if (listing.guideId !== userId) throw new Error("You are not authorized to delete this listing");

  // --> Delete images from Cloudinary
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
      // We continue to delete listing even if image delete fails
    }
  }

  // --> Delete from Database
  const result = await prisma.listing.delete({
    where: { id },
  });
  return result;
};

export const ListingService = {
  createListing,
  getAllListings,
  getSingleListing,
  updateListing,
  deleteListing,
};