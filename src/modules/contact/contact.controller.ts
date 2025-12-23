import { NextResponse } from "next/server";
import AppError from "@/utils/AppError";
import { StatusCodes } from "http-status-codes";
import { sendContactEmail } from "./contact.service";

export const handleContactRequest = async (req: Request) => {
  const body = await req.json();
  const { name, email, subject, message } = body;

  // ভ্যালিডেশন চেক
  if (!name || !email || !subject || !message) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Please fill all the required fields");
  }

  // ইমেইল সার্ভিস কল করা
  await sendContactEmail({ name, email, subject, message });

  return NextResponse.json({
    success: true,
    message: "Your message has been sent successfully!",
  });
};