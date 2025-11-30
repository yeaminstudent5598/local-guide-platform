import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { authGuard } from "@/utils/authGuard";
import { StatusCodes } from "http-status-codes";

export async function POST(req: Request) {
  try {
    // 1. Check Auth (Optional: jodi chaw shudhu logged in user upload korbe)
    await authGuard(["ADMIN", "GUIDE", "TOURIST"]);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // 2. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, "vistara-uploads");

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: result.secure_url,
        },
      },
      { status: StatusCodes.OK }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}