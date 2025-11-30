import { ListingController } from "@/modules/listings/listing.controller";

export const GET = ListingController.getSingle;
export const PATCH = ListingController.update;
export const DELETE = ListingController.delete;