import { cookies } from "next/headers";
import { AuthService } from "@/modules/auth/auth.service"; // ✅ Service Import
import { verifyToken } from "@/lib/jwt";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import ProfileClient from "../../ProfileClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let userData: any = null;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      // ✅ Fetch user directly from Service
      userData = await AuthService.getMe(decoded.id);
    }
  } catch (error) {
    console.error("Profile fetch error:", error);
  }

  if (!userData) {
    return <div className="p-10 text-center">Failed to load profile.</div>;
  }

  return (
    <Suspense fallback={<div className="flex h-[50vh] justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}>
       {/* Pass serialized data */}
       <ProfileClient initialData={JSON.parse(JSON.stringify(userData))} />
    </Suspense>
  );
}