import { ListingService } from "@/modules/listings/listing.service";
import BookingWidget from "@/components/tours/BookingWidget";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import WishlistButton from "@/components/shared/WishlistButton";
import MapWrapper from "@/components/shared/MapWrapper";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, ShieldCheck, Share2, Award, Globe } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

// Next.js 15: params is a Promise
export default async function TourDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch Tour Data
  // Ensure ID is passed as string to prevent "Int" errors
  const tour = await ListingService.getSingleListing(id);

  if (!tour) {
    return notFound();
  }

  // 2. Rating Calculation (Safe check)
  const reviewCount = tour.reviews?.length || 0;
  const avgRating = reviewCount > 0
    ? (tour.reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviewCount).toFixed(1)
    : "New";

  return (
    <div className="bg-white min-h-screen pb-20 pt-22 font-sans">
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- 1. HERO HEADER (Title & Actions) --- */}
        <div className="mb-8">
          <div className="flex flex-col gap-2 mb-4">
             {tour.category && tour.category.length > 0 && (
                <Badge variant="secondary" className="w-fit bg-primary/10 text-primary hover:bg-primary/20">
                   {tour.category[0]}
                </Badge>
             )}
             <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight font-sans">
               {tour.title}
             </h1>
          </div>
          
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 font-medium">
              <span className="flex items-center text-slate-900 font-bold">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1.5" /> {avgRating}
              </span>
              <span>·</span>
              <span className="underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-slate-900 transition">
                {reviewCount} reviews
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 hover:text-slate-900 transition">
                <MapPin className="h-4 w-4 text-slate-500" /> {tour.city}, {tour.country}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-slate-700 hover:bg-slate-100 rounded-full px-4 border border-slate-200">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <div className="hover:bg-slate-100 rounded-full p-2 transition cursor-pointer border border-slate-200 hover:border-slate-300">
                 <WishlistButton listingId={tour.id} />
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. GALLERY (Rounded Grid) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[350px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-sm border border-slate-100">
          <div className="md:col-span-2 relative h-full bg-slate-200 group cursor-pointer">
            <Image 
              src={tour.images[0] || "/placeholder.jpg"} 
              alt={tour.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
            {[1, 2].map((i) => (
              <div key={i} className="relative h-full bg-slate-200 group cursor-pointer">
                {tour.images[i] ? (
                  <Image src={tour.images[i]} alt={`img-${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                   <div className="w-full h-full bg-slate-100" />
                )}
              </div>
            ))}
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
             <div className="relative h-full bg-slate-200 group cursor-pointer">
                {tour.images[3] ? (
                  <Image src={tour.images[3]} alt="img-3" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-slate-100" />
                )}
             </div>
             <div className="relative h-full bg-slate-200 group cursor-pointer overflow-hidden">
                {tour.images[4] ? (
                  <>
                    <Image src={tour.images[4]} alt="img-4" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {tour.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/40 hover:bg-black/50 transition flex items-center justify-center">
                          <Button variant="secondary" size="sm" className="bg-white/90 text-slate-900 hover:bg-white shadow-sm font-medium backdrop-blur-sm">
                            Show all photos
                          </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-slate-100" />
                )}
             </div>
          </div>
        </div>

        {/* --- 3. MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 relative">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Host Info */}
            <div className="flex justify-between items-center pb-8 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  Hosted by {tour.guide?.name}
                </h2>
                <div className="text-slate-500 text-base flex items-center gap-2">
                   <span>{tour.duration} Days</span> · <span>Max {tour.maxGroupSize} Guests</span>
                </div>
              </div>
              <div className="relative h-16 w-16 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                <Image 
                  src={tour.guide?.profileImage || "/placeholder-user.jpg"} 
                  alt={tour.guide?.name || "Guide"} 
                  fill 
                  className="object-cover" 
                />
                {tour.guide?.isVerified && (
                  <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm border border-slate-100" title="Verified">
                      <ShieldCheck className="h-4 w-4 text-green-600 fill-green-100" />
                  </div>
                )}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-6 pb-8 border-b border-slate-200">
              <div className="flex gap-4 items-start">
                <Award className="h-6 w-6 text-slate-900 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Top Rated Experience</h3>
                  <p className="text-slate-500 text-sm">Guests highly rated this guide for their knowledge.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Globe className="h-6 w-6 text-slate-900 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Local Perspective</h3>
                  <p className="text-slate-500 text-sm">Discover hidden gems only locals know about.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Clock className="h-6 w-6 text-slate-900 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Free Cancellation</h3>
                  <p className="text-slate-500 text-sm">Cancel up to 48 hours before for a full refund.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">About this experience</h3>
              <div className="prose prose-slate prose-lg text-slate-600 leading-relaxed whitespace-pre-line font-sans">
                {tour.description}
              </div>
            </div>

            {/* Itinerary */}
            {tour.itinerary && (
              <div className="pb-8 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Where you'll go</h3>
                <div className="pl-6 border-l-2 border-slate-200 space-y-6 ml-2">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-slate-900 ring-4 ring-white"></span>
                    <div className="text-slate-600 whitespace-pre-line leading-7 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      {tour.itinerary}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Map */}
            <div className="pb-8 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Where you'll be</h3>
              <div className="h-[400px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative z-0">
                 {/* Z-0 added to prevent map overlapping sticky header */}
                 <MapWrapper center={[23.8103, 90.4125]} popupText={tour.meetingPoint} />
              </div>
              <div className="mt-4 flex items-center gap-2 text-slate-700 font-medium">
                 <MapPin className="h-5 w-5" /> 
                 <span>Meeting Point: {tour.meetingPoint}</span>
              </div>
            </div>

            {/* Reviews */}
            <div id="reviews" className="pt-4">
              <div className="flex items-center gap-2 mb-8">
                <Star className="h-6 w-6 fill-slate-900 text-slate-900" />
                <h3 className="text-2xl font-bold text-slate-900">
                  {avgRating} · {reviewCount} reviews
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <ReviewList reviews={tour.reviews as any} />
              </div>
              
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                 <h4 className="font-bold text-lg mb-4 text-slate-900">Have you been here? Leave a review</h4>
                 <ReviewForm listingId={tour.id} />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Sticky Booking Widget) */}
          <div className="relative hidden lg:block">
              <div className="sticky top-24">
               <div className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white p-6 space-y-6">
                  
                  <div className="flex justify-between items-end">
                     <div>
                        <span className="text-2xl font-bold text-slate-900">৳{tour.tourFee}</span>
                        <span className="text-slate-500 font-normal text-sm"> / person</span>
                     </div>
                     <div className="flex items-center gap-1 text-sm font-medium text-slate-700 underline decoration-slate-300 cursor-pointer">
                        <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" /> {avgRating}
                     </div>
                  </div>

                  {/* Booking Widget */}
                  <BookingWidget 
                      listingId={tour.id} 
                      price={tour.tourFee} 
                      maxGroupSize={tour.maxGroupSize} 
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      blockedDates={(tour as any).unavailableDates || []}
                  />
                  
                  <div className="text-center pt-2">
                     <p className="text-xs text-slate-400 font-medium">You won't be charged yet</p>
                  </div>

                  <div className="flex justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                     <span className="underline cursor-pointer">Vistara Service Fee</span>
                     <span>৳0</span>
                  </div>
                  
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2">
                     <span>Total</span>
                     <span>৳{tour.tourFee}</span>
                  </div>
               </div>
               
               <div className="mt-6 flex justify-center text-slate-400 text-sm gap-2 hover:text-slate-600 transition cursor-pointer group">
                  <ShieldCheck className="h-4 w-4 group-hover:text-slate-800 transition" /> Report this listing
               </div>
             </div>
          </div>

        </div>
      </div>

      {/* --- MOBILE FIXED BOOKING BAR --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 flex justify-between items-center z-50 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900">৳{tour.tourFee}</span>
              <span className="text-slate-500 text-sm">/ person</span>
            </div>
            <div className="text-xs font-medium underline mt-0.5 text-slate-400">Available dates</div>
         </div>
         <Button size="lg" className="px-8 font-bold bg-primary hover:bg-primary/90 h-12 rounded-xl shadow-lg shadow-primary/20">
            Book Now
         </Button>
      </div>

    </div>
  );
}