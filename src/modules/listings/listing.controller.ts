import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ListingService } from "./listing.service";
import { ListingValidation } from "./listing.validation";
import { authGuard } from "@/utils/authGuard";
import AppError from "@/utils/AppError";

// 1. Create Listing Controller
const create = catchAsync(async (req: Request) => {
  // Only Guide and Admin can create listing
  const user = await authGuard(["GUIDE", "ADMIN"]);
  
  const body = await req.json();

  // Validate Request Body
  const validation = ListingValidation.createListingSchema.safeParse(body);
  
  if (!validation.success) {
    const errorMessage = validation.error.issues.map(e => e.message).join(", ");
    throw new AppError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  // Call Service
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await ListingService.createListing(validation.data, (user as any).id);

  return sendResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Listing created successfully",
    data: result,
  });
});

// 2. Get All Listings Controller (Public)
const getAll = catchAsync(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query: Record<string, unknown> = {};
  
  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  const result = await ListingService.getAllListings(query);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Listings retrieved successfully",
    data: result,
  });
});

// 3. Get Single Listing Controller (Public)
const getSingle = catchAsync(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const result = await ListingService.getSingleListing(id);

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Listing not found");
  }

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Listing retrieved successfully",
    data: result,
  });
});

export const ListingController = {
  create,
  getAll,
  getSingle,
};