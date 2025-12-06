import { cookies } from "next/headers";
import { StatsService } from "@/modules/stats/stats.service"; // ✅ Direct Service Import
import { verifyToken } from "@/lib/jwt";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardStats";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  let stats = {};
  let role = "";
  let userName = "";

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = verifyToken(token);
    if (decoded) {
      role = decoded.role;
      userName = decoded.email.split('@')[0]; // Fallback name
      
      if (role === "ADMIN") {
        redirect("/dashboard/admin");
      }

      // ✅ Server-Side Data Fetching
      stats = await StatsService.getDashboardStats(decoded.id, decoded.role);
    }
  } catch (error) {
    console.error("Dashboard Error:", error);
  }

  return (
    <Suspense fallback={<div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary"/></div>}>
       {/* Pass data to Client Component */}
       <DashboardClient 
          stats={JSON.parse(JSON.stringify(stats))} 
          role={role}
          userName={userName}
       />
    </Suspense>
  );
}