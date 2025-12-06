import { ListingController } from "@/modules/listings/listing.controller";

// Reusing the getAll controller because it already handles search query params
export const GET = ListingController.getAll;