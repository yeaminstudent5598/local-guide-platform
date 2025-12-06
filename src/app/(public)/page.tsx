import HeroSection from "@/components/home/HeroSection";
import FeaturedTours from "@/components/home/FeaturedTours";
import PopularDestinations from "@/components/home/PopularDestinations";
import TopGuides from "@/components/home/TopGuides";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";
import Testimonials from "@/components/home/Testimonials";
import { ListingService } from "@/modules/listings/listing.service";
import { ReviewService } from "@/modules/reviews/review.service";

// ✅ ISR: Revalidate every 1 hour
export const revalidate = 3600;

export default async function HomePage() {

  // ✅ Server-side data fetching
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let featuredTours: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testimonials: any[] = [];

  try {
    // 1. Fetch latest active tours
    const allListings = await ListingService.getAllListings({ 
      isActive: true 
    });
    
    // Take first 6 for featured section
    featuredTours = allListings.slice(0, 6);

    // 2. Fetch testimonials
    // ❌ Error Fix: Instead of passing number 6, we get reviews from the first featured tour (if exists)
    // Or you can fetch global latest reviews if you create a separate service method for it.
    if (featuredTours.length > 0) {
        testimonials = await ReviewService.getReviewsByListing(featuredTours[0].id);
    }
    
  } catch (error) {
    console.error("Failed to fetch home page data", error);
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. Hero Section with Search */}
      <HeroSection />

      {/* 2. Featured Tours (Pass server data) */}
      <FeaturedTours tours={featuredTours} />

      {/* 3. How It Works */}
      <HowItWorks />

      {/* 4. Popular Destinations */}
      <PopularDestinations />

      {/* 5. Top Guides */}
      <TopGuides />

      {/* 6. Real Testimonials */}
      {testimonials.length > 0 && (
         <Testimonials reviews={testimonials} />
      )}

      {/* 7. Call To Action */}
      <CTASection />

    </div>
  );
}