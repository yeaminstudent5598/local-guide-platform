import { UserController } from "@/modules/users/user.controller";

export const GET = UserController.getMe;
export const PATCH = UserController.updateMe;