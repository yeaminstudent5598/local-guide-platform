import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ListingService } from "./listing.service";
import { ListingValidation } from "./listing.validation";
import { authGuard } from "@/utils/authGuard";
import AppError from "@/utils/AppError";

// 1. Create Listing
const create = catchAsync(async (req: Request) => {
  const user = await authGuard(["GUIDE", "ADMIN"]);
  
  const body = await req.json();

  const validation = ListingValidation.createListingSchema.safeParse(body);
  
  if (!validation.success) {
    const errorMessage = validation.error.issues.map(e => e.message).join(", ");
    throw new AppError(StatusCodes.BAD_REQUEST, errorMessage);
  }

  const result = await ListingService.createListing(validation.data, user.id); // ✅ Fixed

  return sendResponse({
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Listing created successfully",
    data: result,
  });
});

// 2. Get All Listings (Public)
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

// 3. Get Single Listing (Public)
const getSingle = catchAsync(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
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
  }
);

// 4. Update Listing (Owner Only)
const update = catchAsync(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const user = await authGuard(["GUIDE", "ADMIN"]);
    const { id } = await params;
    const body = await req.json();

    const validation = ListingValidation.updateListingSchema.safeParse(body);
    
    if (!validation.success) {
      const errorMessage = validation.error.issues.map(e => e.message).join(", ");
      throw new AppError(StatusCodes.BAD_REQUEST, errorMessage);
    }

    const result = await ListingService.updateListing(id, validation.data, user.id); // ✅ Fixed

    return sendResponse({
      statusCode: StatusCodes.OK,
      success: true,
      message: "Listing updated successfully",
      data: result,
    });
  }
);

// 5. Delete Listing (Owner Only)
const deleteListing = catchAsync(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const user = await authGuard(["GUIDE", "ADMIN"]);
    const { id } = await params;

    const result = await ListingService.deleteListing(id, user.id); // ✅ Fixed

    return sendResponse({
      statusCode: StatusCodes.OK,
      success: true,
      message: "Listing deleted successfully",
      data: result,
    });
  }
);

// 6. Toggle Listing Status (Owner Only)
const toggleStatus = catchAsync(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const user = await authGuard(["GUIDE", "ADMIN"]);
    const { id } = await params;

    const result = await ListingService.toggleListingStatus(id, user.id); // ✅ Fixed

    return sendResponse({
      statusCode: StatusCodes.OK,
      success: true,
      message: "Listing status updated successfully",
      data: result,
    });
  }
);

export const ListingController = {
  create,
  getAll,
  getSingle,
  update,
  delete: deleteListing,
  toggleStatus,
};