import { cookies } from "next/headers";
import { EarningService } from "@/modules/earnings/earning.service";
import { verifyToken } from "@/lib/jwt";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import EarningsClient from "../../EarningsClient";

// ✅ 1. Define Interface for Type Safety
interface EarningItem {
  id: string;
  amount: number;
  transactionId: string;
  createdAt: Date;
  booking: {
    tourist: { name: string; email: string };
    listing: { title: string };
  };
}

export default async function EarningsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  // ✅ 2. Apply Type to Variables
  let history: EarningItem[] = []; 
  let totalEarnings = 0;
  let pendingPayout = 0;

  if (token) {
    try {
      const decoded = verifyToken(token);
      // Ensure only Guide or Admin can access
      if (decoded && (decoded.role === "GUIDE" || decoded.role === "ADMIN")) {
        // Direct Service Call
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await EarningService.getMyEarnings(decoded.id, decoded.role);
        
        // Explicitly cast or map data to match interface if needed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        history = data.history as any; 
        totalEarnings = data.total;
        pendingPayout = data.pending;
      }
    } catch (error) {
      console.error("Earnings fetch error:", error);
    }
  }

  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}>
       {/* JSON Serialization to avoid Date object issues between Server & Client */}
       <EarningsClient 
          history={JSON.parse(JSON.stringify(history))} 
          totalEarnings={totalEarnings}
          pendingPayout={pendingPayout}
       />
    </Suspense>
  );
}