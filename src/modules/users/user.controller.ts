import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";
import { authGuard } from "@/utils/authGuard";

const getAllUsers = catchAsync(async (req: Request) => {
  // Only Admin can see all users
  await authGuard(["ADMIN"]);

  const result = await UserService.getAllUsers();

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await authGuard(["ADMIN"]);
  const { id } = await params;

  const result = await UserService.deleteUser(id);

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});
// Profile: Get Me
const getMe = catchAsync(async () => {
  const user = await authGuard(["ADMIN", "GUIDE", "TOURIST"]);
  const result = await UserService.getSingleUser(user.id);
  return sendResponse({ statusCode: StatusCodes.OK, success: true, message: "Profile retrieved", data: result });
});

// Profile: Update Me
const updateMe = catchAsync(async (req: Request) => {
  const user = await authGuard(["ADMIN", "GUIDE", "TOURIST"]);
  const body = await req.json();
  const result = await UserService.updateProfile(user.id, body);
  return sendResponse({ statusCode: StatusCodes.OK, success: true, message: "Profile updated", data: result });
});


const getUserById = catchAsync(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  if (!id) {
    return sendResponse({
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "User ID is required",
      data: null,
    });
  }

  const result = await UserService.getUserById(id);
  
  if (!result) {
    return sendResponse({
      statusCode: StatusCodes.NOT_FOUND,
      success: false,
      message: "User not found",
      data: null,
    });
  }

  return sendResponse({
    statusCode: StatusCodes.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});
export const UserController = {
  getAllUsers,
  deleteUser,
  getMe,
  updateMe,
  getUserById,
};