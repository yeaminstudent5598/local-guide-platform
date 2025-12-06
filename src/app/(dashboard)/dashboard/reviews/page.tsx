import { cookies } from "next/headers";
import { ReviewService } from "@/modules/reviews/review.service";
import { verifyToken } from "@/lib/jwt";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ReviewsClient from "../../ReviewsClient";

export default async function ReviewsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let reviews: any[] = [];
  let userRole = "";

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded) {
        userRole = decoded.role;
        // Direct Service Call
        const result = await ReviewService.getMyReviews(decoded.id, decoded.role);
        reviews = result;
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }

  return (
    <Suspense fallback={<div className="flex h-[50vh] justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>}>
       {/* Pass serialized data */}
       <ReviewsClient 
          reviews={JSON.parse(JSON.stringify(reviews))} 
          userRole={userRole} 
       />
    </Suspense>
  );
}