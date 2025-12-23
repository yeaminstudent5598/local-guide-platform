import { NextResponse } from "next/server";
import AppError from "@/utils/AppError";
import { StatusCodes } from "http-status-codes";
import { toggleWishlistInDB } from "./wishlist.service";

export const toggleWishlist = async (req: Request, userId: string) => {
  const body = await req.json();
  const { listingId } = body;

  if (!listingId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Listing ID is required");
  }

  const result = await toggleWishlistInDB(userId, listingId);

  return NextResponse.json({
    success: true,
    message: result.message,
    data: result.isWishlisted,
  });
};