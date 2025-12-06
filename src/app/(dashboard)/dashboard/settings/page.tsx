import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import SettingsClient from "../../SettingsClient";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      redirect("/login");
    }
  } catch (error) {
    redirect("/login");
  }

  return <SettingsClient />;
}