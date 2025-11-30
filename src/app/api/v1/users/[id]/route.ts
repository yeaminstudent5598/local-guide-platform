import { ListingController } from "@/modules/listings/listing.controller";
import catchAsync from "@/utils/catchAsync";
import { ListingService } from "@/modules/listings/listing.service";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authGuard } from "@/utils/authGuard";

export const GET = ListingController.getSingle;

// Update (Patch) - আলাদা করে এখানে লিখলাম কারণ params type Next.js এ একটু ভিন্ন
export const PATCH = catchAsync(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await authGuard(["GUIDE", "ADMIN"]);
  const id = (await params).id;
  const body = await req.json();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await ListingService.updateListing(id, body, (user as any).id);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Listing updated successfully",
    data: result,
  });
});

// Delete
export const DELETE = catchAsync(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await authGuard(["GUIDE", "ADMIN"]);
  const id = (await params).id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await ListingService.deleteListing(id, (user as any).id);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Listing deleted successfully",
    data: result,
  });
});