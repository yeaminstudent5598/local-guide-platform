import { WishlistController } from "@/modules/wishlist/wishlist.controller";

export const GET = WishlistController.getWishlist;
export const POST = WishlistController.toggleWishlist;