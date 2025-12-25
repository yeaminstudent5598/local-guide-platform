"use client";

import { useEffect, useState, use } from "react";
import { 
  Star, MapPin, Calendar, ShieldCheck, 
  MessageCircle, Heart, Share2, Clock, 
  Loader2, Compass, ArrowRight, X, Phone, Mail, Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function GuideProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const guideId = resolvedParams.id;

  const [guide, setGuide] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  
  const [showContactModal, setShowContactModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);

  // ১. গাইড ডাটা এবং ট্যুর ফেচ করা
  useEffect(() => {
    if (!guideId) return;

    const fetchGuideData = async () => {
      try {
        setLoading(true);
        const [guideRes, listingsRes, reviewsRes, ratingRes] = await Promise.all([
          fetch(`/api/v1/users/${guideId}`),
          fetch(`/api/v1/listings?guideId=${guideId}`),
          fetch(`/api/v1/reviews/guide/${guideId}`),
          fetch(`/api/v1/reviews/rating/${guideId}`)
        ]);

        const guideData = await guideRes.json();
        const listingsData = await listingsRes.json();
        const reviewsData = await reviewsRes.json();
        const ratingData = await ratingRes.json();

        if (guideData.success) setGuide(guideData.data);

        const allListings = listingsData.data || [];
        const specificGuideTours = allListings.filter((tour: any) => tour.guideId === guideId);
        setTours(specificGuideTours);

        setReviews(reviewsData.data || []);
        setRating(ratingData.data || { average: 0, count: 0 });

      } catch (error) {
        console.error(error);
        toast.error("তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchGuideData();
  }, [guideId]);

  // ২. উইশলিস্ট স্ট্যাটাস চেক করা (ইনিশিয়াল চেক)
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("accessToken");
      if (token && guideId) {
        try {
          const res = await fetch(`/api/v1/wishlist/check/${guideId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) setLiked(data.isWishlisted);
        } catch (err) { console.log("Wishlist check error", err); }
      }
    };
    checkWishlist();
  }, [guideId]);

  // --- হ্যান্ডলার: উইশলিস্ট টগল ---
  const handleToggleWishlist = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("উইশলিস্টে যোগ করতে দয়া করে লগইন করুন");
      return;
    }

    try {
      setIsWishlisting(true);
      const res = await fetch(`/api/v1/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ guideId })
      });

      const data = await res.json();
      if (data.success) {
        setLiked(!liked);
        toast.success(liked ? "উইশলিস্ট থেকে সরানো হয়েছে" : "উইশলিস্টে যোগ করা হয়েছে");
      }
    } catch (error) {
      toast.error("উইশলিস্ট আপডেট করা যায়নি");
    } finally {
      setIsWishlisting(false);
    }
  };

  // --- হ্যান্ডলার: শেয়ার বাটন ---
  const handleShare = async () => {
    const shareData = {
      title: `${guide?.name} - Expert Local Guide`,
      text: `Check out ${guide?.name}'s profile on Guided.com!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("প্রোফাইল লিঙ্ক কপি করা হয়েছে!");
      }
    } catch (error) {
      console.log("Error sharing", error);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* --- 🏔️ HERO SECTION WITH COVER IMAGE --- */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1503221043305-f7498f8b7888?q=80&w=2070" 
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="container relative h-full mx-auto px-6 flex flex-col justify-end pb-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            
            <div className="relative group">
              <div className="h-32 w-32 md:h-44 md:w-44 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                <Image
                  src={guide?.profileImage || "https://i.ibb.co/5GzXkwq/user-placeholder.png"}
                  alt={guide?.name}
                  fill
                  className="object-cover"
                />
              </div>
              {guide?.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-xl border-4 border-white">
                  <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left text-white mb-2">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none mb-3 font-bold">
                Expert Local Guide
              </Badge>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-md">
                {guide?.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-white/80 text-sm font-medium">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-emerald-400" /> {guide?.location || "Bangladesh"}</span>
                <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-blue-400" /> Member since 2025</span>
              </div>
            </div>

            {/* --- ফাংশনাল বাটনসমূহ --- */}
            <div className="flex gap-2 pb-2">
              <Button onClick={() => setShowContactModal(true)} className="bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl h-11 px-6 shadow-xl border-none transition-all">
                Contact
              </Button>
              
              {/* উইশলিস্ট বাটন */}
              <Button 
                variant="outline" 
                className={`bg-black/20 backdrop-blur-md border-white/20 h-11 w-11 p-0 rounded-xl transition-all ${liked ? 'hover:bg-rose-500/20' : 'hover:bg-white/30'}`}
                onClick={handleToggleWishlist}
                disabled={isWishlisting}
              >
                {isWishlisting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <Heart className={`h-5 w-5 ${liked ? 'fill-rose-500 text-rose-500 border-none' : 'text-white'}`} />
                )}
              </Button>

              {/* শেয়ার বাটন */}
              <Button 
                variant="outline" 
                className="bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-white/30 h-11 w-11 p-0 rounded-xl transition-all"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS & MAIN CONTENT (আপনার আগের ডিজাইন অনুযায়ী) --- */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-wrap justify-center md:justify-start gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">{rating.average.toFixed(1)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Average Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">{rating.count}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Compass className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">{tours.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Tours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">About Me</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {guide?.bio || `Professional guide specializing in local traditions and photography.`}
              </p>
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {guide?.languages?.map((l: string, i: number) => (
                      <Badge key={i} className="bg-slate-100 text-slate-600 border-none rounded-lg">{l}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
              Hosted Experiences <Badge className="bg-slate-100 text-slate-600 border-none">{tours.length}</Badge>
            </h2>

            <div className="space-y-4">
              {tours.length > 0 ? tours.map((tour: any) => (
                <Link key={tour.id} href={`/tours/${tour.id}`} className="block group">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 hover:border-emerald-500 hover:shadow-xl transition-all duration-300">
                    <div className="relative h-32 w-full md:w-44 rounded-xl overflow-hidden shrink-0">
                      <Image src={tour.images?.[0] || "https://i.ibb.co/VvzYnRd/tour-placeholder.png"} alt={tour.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">{tour.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {tour.city}</p>
                    </div>
                    <div className="flex flex-col justify-center items-end border-l border-slate-50 pl-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Price</p>
                      <p className="text-lg font-black text-slate-900">৳{Number(tour.tourFee).toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl py-20 text-center text-slate-400 font-bold">
                  No specific tours available for this storyteller yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- মডাল --- */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Connect</h3>
                <X className="h-5 w-5 cursor-pointer text-slate-400" onClick={() => setShowContactModal(false)} />
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{guide?.email}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}