import { prisma } from "@/lib/prisma";

// 1. Get All Users (Admin Only)
const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      _count: {
        select: {
          listings: true, // কতগুলো লিস্টিং আছে
          bookingsAsTourist: true, // কতগুলো বুকিং দিয়েছে
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// 2. Delete User
const deleteUser = async (id: string) => {
  const result = await prisma.user.delete({
    where: { id },
  });
  return result;
};

// 3. Update User Role/Status (Optional Bonus)
const updateUserStatus = async (id: string, payload: any) => {
  const result = await prisma.user.update({
    where: { id },
    data: payload,
  });
  return result;
};

// 2. Get Single User (For Profile)
const getSingleUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, role: true,
      profileImage: true, bio: true, phone: true,
      isVerified: true, createdAt: true,
    }
  });
  return result;
};

const updateProfile = async (id: string, payload: any) => {
  const result = await prisma.user.update({
    where: { id },
    data: payload,
    select: { 
      id: true, 
      name: true, 
      email: true, 
      profileImage: true, 
      bio: true, 
      phone: true,
      languages: true, // ✅ যোগ করা হয়েছে
      expertise: true  // ✅ যোগ করা হয়েছে
    }
  });
  return result;
};

// ✅ 1. Get Single User by ID (For Guide Profile)
const getUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      bio: true,
      phone: true,
      isVerified: true,
      languages: true, // ✅ এই ফিল্ডটি নিশ্চিত করুন
      expertise: true, // ✅ এই ফিল্ডটি নিশ্চিত করুন
      createdAt: true,
    },
  });
  return result;
};


 const getPublicGuidesFromDB = async (limit: number) => {
  return await prisma.user.findMany({
    where: {
      role: "GUIDE",
    },
    take: limit || 3,
    select: {
      id: true,
      name: true,
      profileImage: true,
      bio: true,
      isVerified: true,
      expertise: true,
      languages: true,
      _count: {
        select: {
          reviewsReceived: true,
          listings: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const UserService = {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getSingleUser,
  updateProfile,
  getUserById,
  getPublicGuidesFromDB,
};