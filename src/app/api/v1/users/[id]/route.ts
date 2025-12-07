import { UserController } from "@/modules/users/user.controller";

// ইউজার ডিলিট করার জন্য (Admin Only)
export const DELETE = UserController.deleteUser;