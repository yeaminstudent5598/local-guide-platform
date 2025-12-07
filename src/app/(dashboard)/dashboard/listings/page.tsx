import { cookies } from "next/headers";
import { ListingService } from "@/modules/listings/listing.service";
import { verifyToken } from "@/lib/jwt";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ListingsClient from "../../ListingsClient";

export default async function MyListingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  let listings: any[] = [];

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded && decoded.role === "GUIDE") {
        listings = await ListingService.getListingsByGuideId(decoded.id);
      }
    } catch (error) {
      console.error("Fetch listings error:", error);
    }
  }

  return (
    <Suspense fallback={<div className="flex h-[50vh] justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
       {/* Pass serialized data to client component */}
       <ListingsClient initialListings={JSON.parse(JSON.stringify(listings))} />
    </Suspense>
  );
}