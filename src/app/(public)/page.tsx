// src/app/(public)/page.tsx

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
  let featuredTours = [];
  let testimonials = [];

  try {
    // Fetch latest 6 active tours
    const allListings = await ListingService.getAllListings({ 
      isActive: true 
    });
    featuredTours = allListings.slice(0, 6);

    // Fetch top reviews for testimonials
    testimonials = await ReviewService.getReviewsByListing(6);
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
      <Testimonials reviews={testimonials} />

      {/* 7. Call To Action */}
      <CTASection />

    </div>
  );
}