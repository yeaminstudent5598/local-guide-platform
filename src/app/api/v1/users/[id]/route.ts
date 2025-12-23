import { UserController } from "@/modules/users/user.controller";

export const GET = UserController.getUserById;
export const DELETE = UserController.deleteUser;
export const PUT = UserController.updateMe;
