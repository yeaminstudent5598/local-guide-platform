import catchAsync from "@/utils/catchAsync";
import { authGuard } from "@/utils/authGuard";
import { toggleWishlist } from "@/modules/service/wishlist.controller";

export const POST = catchAsync(async (req: Request) => {
  const user = await authGuard();
  return await toggleWishlist(req, user.id);
});