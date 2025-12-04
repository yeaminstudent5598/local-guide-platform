import { NextResponse } from "next/server";

export async function POST() {
  // IPN (Instant Payment Notification) usually verified here
  return NextResponse.json({ message: "IPN received" });
}