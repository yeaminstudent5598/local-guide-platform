import { UserService } from "@/modules/users/user.service";
import { ReviewService } from "@/modules/reviews/review.service";
import { ListingService } from "@/modules/listings/listing.service";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, MapPin, Globe, Award, Calendar,
  ShieldCheck, User, Languages
} from "lucide-react";
import Link from "next/link";
import ReviewList from "@/components/reviews/ReviewList";

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function GuideProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // 1. Fetch Guide Data
  const guide = await UserService.getUserById(id);

  if (!guide || guide.role !== "GUIDE") {
    return notFound();
  }

  // 2. Fetch Guide's Listings (Using existing service logic)
  // Note: We are fetching ALL listings then filtering by guideId manually if service doesn't support direct filter
  // Better approach: ListingService.getAllListings({ guideId: id }) if supported
  // Assuming you updated getAllListings to accept guideId, or we filter here:
  const allListings = await ListingService.getAllListings({});
  const listings = allListings.filter((item: any) => item.guideId === id && item.isActive);

  // 3. Fetch Reviews & Stats
  const reviews = await ReviewService.getGuideReviews(id);
  const rating = await ReviewService.getGuideRating(id);

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- HERO HEADER --- */}
      <div className="bg-slate-900 text-white pt-20 pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            
            {/* Profile Image */}
            <div className="relative shrink-0">
              <div className="h-40 w-40 md:h-56 md:w-56 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <Image
                  src={guide.profileImage || "/placeholder-user.jpg"}
                  alt={guide.name}
                  fill
                  className="object-cover"
                />
              </div>
              {guide.isVerified && (
                <div className="absolute bottom-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-slate-900" title="Verified Guide">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{guide.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-slate-300">
                   <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Dhaka, Bangladesh</span>
                   <span>•</span>
                   <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {new Date(guide.createdAt).getFullYear()}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-xl">{rating.average.toFixed(1)}</span>
                    <span className="text-sm text-slate-300">({rating.count} Reviews)</span>
                 </div>
                 <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-400" />
                    <span className="font-bold text-xl">{listings.length}</span>
                    <span className="text-sm text-slate-300">Tours Hosted</span>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
           
           {/* Left Sidebar: About */}
           <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg border-none">
                 <CardContent className="p-6 space-y-6">
                    <div>
                       <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" /> About Me
                       </h3>
                       <p className="text-slate-600 leading-relaxed text-sm">
                          {guide.bio || "Hi, I'm a passionate local guide. I love showing travelers the hidden gems of my city. Join me for an unforgettable experience!"}
                       </p>
                    </div>

                    {guide.languages && guide.languages.length > 0 && (
                       <div>
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                             <Languages className="h-5 w-5 text-primary" /> Languages
                          </h3>
                          <div className="flex flex-wrap gap-2">
                             {guide.languages.map((lang, i) => (
                                <Badge key={i} variant="secondary">{lang}</Badge>
                             ))}
                          </div>
                       </div>
                    )}

                    {guide.expertise && guide.expertise.length > 0 && (
                       <div>
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                             <Award className="h-5 w-5 text-primary" /> Expertise
                          </h3>
                          <div className="flex flex-wrap gap-2">
                             {guide.expertise.map((skill, i) => (
                                <Badge key={i} variant="outline">{skill}</Badge>
                             ))}
                          </div>
                       </div>
                    )}

                    <div className="pt-4 border-t">
                       <Button className="w-full" variant="outline">Contact Guide</Button>
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* Right Content: Listings & Reviews */}
           <div className="lg:col-span-2 space-y-10">
              
              {/* Active Listings */}
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-6">Tours by {guide.name}</h2>
                 {listings.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                       {listings.map((tour: any) => (
                          <Link href={`/tours/${tour.id}`} key={tour.id} className="group">
                             <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-all h-full">
                                <div className="relative h-40 bg-slate-200">
                                   <Image src={tour.images[0] || "/placeholder.jpg"} alt={tour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <CardContent className="p-4">
                                   <h3 className="font-bold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">{tour.title}</h3>
                                   <div className="flex justify-between items-center text-sm text-slate-500">
                                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {tour.city}</span>
                                      <span className="font-bold text-primary">৳{tour.tourFee}</span>
                                   </div>
                                </CardContent>
                             </Card>
                          </Link>
                       ))}
                    </div>
                 ) : (
                    <div className="p-8 text-center border-2 border-dashed rounded-xl text-slate-500">
                       No active tours found.
                    </div>
                 )}
              </div>

              {/* Reviews */}
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-6">What travelers are saying</h2>
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 <ReviewList reviews={reviews as any} />
              </div>

           </div>
        </div>
      </div>

    </div>
  );
}

// Import Button dynamically to avoid server errors if needed, 
// but standard import works in server components too for rendering.
import { Button } from "@/components/ui/button";