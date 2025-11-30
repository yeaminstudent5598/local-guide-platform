// src/app/(public)/page.tsx

// 1. ইম্পোর্ট সেকশন (Import Section)
import HeroSection from "@/components/home/HeroSection";
import FeaturedTours from "@/components/home/FeaturedTours";
import { Button } from "@/components/ui/button";
import { Globe, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 2. Hero Section ব্যবহার */}
      <HeroSection />

      {/* 3. Featured Tours Section ব্যবহার */}
      <FeaturedTours />

      {/* 4. How It Works Section (Manual Code) */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center p-6 space-y-4 rounded-xl bg-slate-50 border">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">1. Find a Tour</h3>
              <p className="text-muted-foreground">
                Browse through hundreds of unique tours and find the perfect match.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center p-6 space-y-4 rounded-xl bg-slate-50 border">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">2. Book a Guide</h3>
              <p className="text-muted-foreground">
                Connect with verified local experts and book instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center p-6 space-y-4 rounded-xl bg-slate-50 border">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">3. Enjoy the Trip</h3>
              <p className="text-muted-foreground">
                Experience the destination like a local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call to Action Section */}
      <section className="py-20 bg-primary/10">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Share Your World</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Become a local guide and turn your passion for your city into income.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register?role=GUIDE">
              <Button size="lg" className="px-8 text-lg">Become a Guide</Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}