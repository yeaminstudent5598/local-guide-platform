import { cookies } from "next/headers";
import { AuthService } from "@/modules/auth/auth.service";
import { verifyToken } from "@/lib/jwt";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import ProfileClient from "../../ProfileClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  let userData: any = null;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      userData = await AuthService.getMe(decoded.id);
    }
  } catch (error) {
    console.error("Profile fetch error:", error);
  }

  if (!userData) {
    return <div className="p-10 text-center text-slate-500 font-bold">Failed to load profile. Please login again.</div>;
  }

  // ডাটাবেজের String Array কে UI এর জন্য কমা সেপারেটেড স্ট্রিং করা
  const profileInitialData = {
    ...userData,
    languages: userData.languages?.join(', ') || "",
    expertise: userData.expertise?.join(', ') || "",
  };

  return (
    <Suspense fallback={
        <div className="flex h-[60vh] justify-center items-center flex-col gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600"/>
            <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">Syncing Identity</p>
        </div>
    }>
       <ProfileClient initialData={JSON.parse(JSON.stringify(profileInitialData))} />
    </Suspense>
  );
}