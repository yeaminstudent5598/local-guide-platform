import TourForm from "@/components/forms/TourForm";
import { ListingService } from "@/modules/listings/listing.service";
import { authGuard } from "@/utils/authGuard";
import { redirect } from "next/navigation";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Auth Check (Server Side)
  // Ensure only Guide/Admin can access
  try {
     await authGuard(["GUIDE", "ADMIN"]);
  } catch (error) {
     redirect("/login");
  }

  // 2. Get Listing ID
  const { id } = await params;

  // 3. Fetch Listing Data
  const listing = await ListingService.getSingleListing(id);

  if (!listing) {
    return (
      <div className="p-8 text-center text-red-500">
        Listing not found!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Listing</h2>
        <p className="text-muted-foreground">
          Update the details of your tour package.
        </p>
      </div>
      
      {/* 4. Pass Data to Form with isEdit=true */}
      <TourForm initialData={listing} isEdit={true} />
    </div>
  );
}