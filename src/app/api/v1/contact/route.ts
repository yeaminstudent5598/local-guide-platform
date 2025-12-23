import { handleContactRequest } from "@/modules/contact/contact.controller";
import catchAsync from "@/utils/catchAsync";

export const POST = catchAsync(async (req: Request) => {
  return await handleContactRequest(req);
});