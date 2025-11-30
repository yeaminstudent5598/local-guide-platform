import { ListingService } from "@/modules/listings/listing.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Next.js 15 e params ekta Promise
export default async function TourDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch Data
  const tour = await ListingService.getSingleListing(id);

  if (!tour) {
    return notFound();
  }

  return (
    <div className="container py-10 space-y-8">
      
      {/* 1. Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Link href="/explore" className="hover:text-primary">Tours</Link>
          <span>/</span>
          <span className="text-foreground">{tour.city}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">{tour.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-primary" />
            {tour.meetingPoint}, {tour.city}, {tour.country}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">4.8</span> (12 Reviews)
          </div>
        </div>
      </div>

      {/* 2. Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px]">
        <div className="md:col-span-2 relative h-full rounded-xl overflow-hidden">
          <Image 
            src={tour.images[0] || "/placeholder.jpg"} 
            alt={tour.title} 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
          {tour.images[1] && (
            <div className="relative h-full rounded-xl overflow-hidden">
              <Image src={tour.images[1]} alt="gallery" fill className="object-cover" />
            </div>
          )}
          {tour.images[2] && (
            <div className="relative h-full rounded-xl overflow-hidden">
              <Image src={tour.images[2]} alt="gallery" fill className="object-cover" />
            </div>
          )}
        </div>
        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
           {tour.images[3] && (
            <div className="relative h-full rounded-xl overflow-hidden">
              <Image src={tour.images[3]} alt="gallery" fill className="object-cover" />
            </div>
          )}
           {tour.images[4] && (
            <div className="relative h-full rounded-xl overflow-hidden">
              <Image src={tour.images[4]} alt="gallery" fill className="object-cover" />
              {tour.images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
                  +{tour.images.length - 5}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 3. Main Content (Left) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Info */}
          <div className="flex gap-6 border-b pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{tour.duration} Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Group Size</p>
                <p className="font-medium">Max {tour.maxGroupSize}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">About this tour</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {tour.description}
            </p>
          </div>

          {/* Itinerary */}
          {tour.itinerary && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Itinerary</h3>
              <div className="bg-slate-50 p-6 rounded-xl border whitespace-pre-line text-sm leading-loose">
                {tour.itinerary}
              </div>
            </div>
          )}

          {/* Guide Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Meet your guide</h3>
            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                  <Image 
                    src={tour.guide?.profileImage || "/placeholder-user.jpg"} 
                    alt={tour.guide?.name || "Guide"} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg">{tour.guide?.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> Guide since {new Date(tour.guide?.createdAt || "").getFullYear()}
                  </p>
                  <p className="text-sm pt-2">{tour.guide?.bio || "No bio available."}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 4. Booking Sidebar (Right) */}
        <div className="relative">
          <Card className="sticky top-24 shadow-lg border-primary/20">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">৳ {tour.tourFee}</span>
                  <span className="text-muted-foreground">/ person</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Date</span>
                    <span className="font-medium text-primary cursor-pointer">Select Date</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Guests</span>
                    <span className="font-medium">1 Person</span>
                  </div>
                </div>

                <Button className="w-full h-12 text-lg">
                  Request to Book
                </Button>
                
                <p className="text-center text-xs text-muted-foreground">
                  You won&apos;t be charged yet
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}