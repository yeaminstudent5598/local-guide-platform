import { ListingService } from "@/modules/listings/listing.service";
import BookingWidget from "@/components/tours/BookingWidget";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import MapWrapper from "@/components/shared/MapWrapper";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, Clock, Star, ShieldCheck, 
  Award, Globe, Info, Calendar, Users, 
  CheckCircle2, Navigation, ArrowLeft
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MobileBookingAction from "@/components/tours/MobileBookingAction";
import TourActionButtons from "../TourActionButtons";

export default async function TourDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // ১. ট্যুর ডাটা ফেচ করা
  const tour = await ListingService.getSingleListing(id);

  if (!tour) {
    return notFound();
  }

  // ২. রেটিং ক্যালকুলেশন
  const reviewCount = tour.reviews?.length || 0;
  const avgRating = reviewCount > 0
    ? (tour.reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviewCount).toFixed(1)
    : "New";

  return (
    <div className="bg-white min-h-screen">
      
      {/* --- 🖤 ১. প্রিমিয়াম ডার্ক হেডার (Share & Wishlist সহ) --- */}
      <div className="relative overflow-hidden bg-slate-950 pt-36 pb-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src={tour.images[0] || "/placeholder.jpg"} 
            alt="header-bg" 
            fill 
            className="object-cover opacity-20 grayscale" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="container relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <Link href="/explore" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400 hover:text-white transition-all">
                <ArrowLeft className="h-3 w-3" /> Return to Terminal
              </Link>
              
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
                  {tour.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                    <span className="font-bold text-white text-sm">{avgRating}</span>
                    <span className="text-slate-400 text-xs">({reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-emerald-500" /> 
                    <span className="underline decoration-slate-700 underline-offset-4 decoration-2">{tour.city}, {tour.country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ সচল একশন বাটন (Client Component) */}
            <TourActionButtons tourId={tour.id} tourTitle={tour.title} />
          </div>
        </div>
      </div>

      {/* --- 📦 ২. পেজ কন্টেন্ট (সাদা ব্যাকগ্রাউন্ড) --- */}
      <div className="bg-white -mt-10 relative z-20 rounded-t-[3rem] pt-12">
        <div className="container max-w-7xl mx-auto px-6">
          
          {/* গ্যালারি সেকশন */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[350px] md:h-[550px] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl shadow-slate-200/40">
            <div className="md:col-span-2 relative h-full group overflow-hidden">
              <Image src={tour.images[0] || "/placeholder.jpg"} alt={tour.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" priority />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="relative h-full bg-slate-100 overflow-hidden group">
                  <Image src={tour.images[i] || "/placeholder.jpg"} alt="sub" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              ))}
            </div>
            <div className="hidden md:grid grid-rows-2 gap-4">
               <div className="relative h-full overflow-hidden group">
                 <Image src={tour.images[3] || "/placeholder.jpg"} alt="sub" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
               </div>
               <div className="relative h-full overflow-hidden group">
                 <Image src={tour.images[4] || "/placeholder.jpg"} alt="sub" fill className="object-cover group-hover:scale-110 transition-all" />
                 <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" className="rounded-xl font-bold text-[10px] uppercase tracking-widest">Show All Photos</Button>
                 </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* বাম কলাম: বিবরণ এবং তথ্য */}
            <div className="lg:col-span-8 space-y-20">
              
              <div className="flex items-center justify-between pb-10 border-b border-slate-50">
                 <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Hosted by {tour.guide?.name}</h2>
                    <p className="text-slate-400 text-sm font-medium italic">Professional Guide · {tour.duration} Days Expedition</p>
                 </div>
                 <div className="relative h-16 w-16 rounded-[1.5rem] overflow-hidden border-2 border-slate-100 shadow-xl shadow-slate-200/50">
                    <Image src={tour.guide?.profileImage || "/placeholder-user.jpg"} alt="guide" fill className="object-cover" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <HighlightCard icon={Award} title="Top Selection" desc="Highly rated for local storytelling." />
                 <HighlightCard icon={ShieldCheck} title="Verified Safe" desc="Guaranteed secure travel protocols." />
                 <HighlightCard icon={Globe} title="Local Soul" desc="Access spots hidden from standard maps." />
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                   <Info className="h-6 w-6 text-emerald-500" /> Expedition Insight
                </h3>
                <div className="text-slate-500 leading-[1.8] text-lg font-medium whitespace-pre-line">
                  {tour.description}
                </div>
              </div>

              {/* ম্যাপ সেকশন */}
              <div className="space-y-6">
                 <h3 className="text-2xl font-bold text-slate-900">The Meeting Point</h3>
                 <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner">
                    <MapWrapper center={[23.8103, 90.4125]} popupText={tour.meetingPoint} />
                 </div>
              </div>

              {/* রিভিউ সেকশন */}
              <div id="reviews" className="space-y-10 pt-10">
                 <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Guest Stories</h3>
                    <div className="flex items-center gap-2 font-black text-emerald-600 text-lg uppercase tracking-widest">{avgRating} <Star className="h-4 w-4 fill-emerald-600" /></div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <ReviewList reviews={tour.reviews as any} />
                 </div>
                 <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                    <ReviewForm listingId={tour.id} />
                 </div>
              </div>

            </div>

            {/* ডান কলাম: বুকিং উইজেট */}
            <div className="lg:col-span-4 relative hidden lg:block">
              <div className="sticky top-28">
                 <BookingWidget 
                    listingId={tour.id} 
                    price={tour.tourFee} 
                    maxGroupSize={tour.maxGroupSize} 
                    blockedDates={(tour as any).unavailableDates || []}
                 />
                 <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                    Secure transaction protected by <br/> <span className="text-emerald-600">Vistara Expedition Trust</span>
                 </p>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* মোবাইল বুকিং একশন */}
      <MobileBookingAction tour={tour} />
    </div>
  );
}

const HighlightCard = ({ icon: Icon, title, desc }: any) => (
  <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all">
     <Icon className="h-6 w-6 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
     <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
     <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);