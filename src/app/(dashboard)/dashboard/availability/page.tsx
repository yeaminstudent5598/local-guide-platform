import { cookies } from "next/headers";
import { ListingService } from "@/modules/listings/listing.service";
import { verifyToken } from "@/lib/jwt";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AvailabilityClient from "../../AvailabilityClient";

export default async function AvailabilityPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let listings: any[] = [];

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded && decoded.role === "GUIDE") {
        // Fetch listings for the logged-in guide directly from service
        listings = await ListingService.getListingsByGuideId(decoded.id);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  return (
    <Suspense fallback={<div className="flex h-[50vh] justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>}>
       {/* Pass serialized data to client component */}
       <AvailabilityClient listings={JSON.parse(JSON.stringify(listings))} />
    </Suspense>
  );
}