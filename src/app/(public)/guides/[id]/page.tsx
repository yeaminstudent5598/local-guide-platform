"use client";

import { useEffect, useState } from "react";
import { 
  Star, MapPin, Calendar, ShieldCheck, 
  Languages, MessageCircle, Heart, Share2, Clock, 
  Loader2, Navigation, Compass, CheckCircle2, 
  Briefcase, ArrowRight, ExternalLink, Users, Wallet, Zap,
  Mail, Phone, X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function GuideProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [guide, setGuide] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [guideId, setGuideId] = useState<string>("");
  
  // --- New Dynamic States ---
  const [showContactModal, setShowContactModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params;
      setGuideId(id);
    };
    getParams();
  }, [params]);

  // ১. গাইড ডাটা ফেচ করা
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
        setTours(listingsData.data || []);
        setReviews(reviewsData.data || []);
        setRating(ratingData.data || { average: 0, count: 0 });

      } catch (error) {
        console.error(error);
        toast.error("গাইড তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchGuideData();
  }, [guideId]);

  // ২. ইনিশিয়াল উইশলিস্ট স্ট্যাটাস চেক করা (যদি ইউজার লগ-ইন থাকে)
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

  // --- হ্যান্ডলার: শেয়ার বাটন ---
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
        toast.success("প্রোফাইল লিঙ্ক কপি করা হয়েছে!");
      }
    } catch (error) {
      console.log("Error sharing", error);
    }
  };

  // --- হ্যান্ডলার: উইশলিস্ট টগল ---
  const handleToggleWishlist = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("উইশলিস্টে যোগ করতে দয়া করে লগইন করুন");
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
        toast.success(liked ? "উইশলিস্ট থেকে সরানো হয়েছে" : "উইশলিস্টে যোগ করা হয়েছে");
      }
    } catch (error) {
      toast.error("উইশলিস্ট আপডেট করা যায়নি");
    } finally {
      setIsWishlisting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-slate-500">
        গাইড তথ্য পাওয়া যায়নি
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* --- 🌿 HERO SECTION --- */}
      <div className="bg-white border-b border-slate-200/60 pt-32 pb-16 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10">
            
            {/* Profile Avatar Frame */}
            <div className="relative">
              <div className="h-44 w-44 lg:h-52 lg:w-52 rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50 relative">
                <Image
                  src={guide?.profileImage || "https://i.ibb.co/5GzXkwq/user-placeholder.png"}
                  alt={guide?.name || "Guide"}
                  fill
                  className="object-cover"
                />
              </div>
              {guide?.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 text-center lg:text-left space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                   <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none rounded-lg px-3 py-1 text-[10px] uppercase tracking-wider font-bold">
                      Expert Local Guide
                   </Badge>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                  {guide?.name}
                </h1>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-1 text-slate-500 font-medium text-sm">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {guide?.location || "Bangladesh"}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Member since {guide?.createdAt ? new Date(guide.createdAt).getFullYear() : "2025"}</span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {[
                  { label: "Rating", value: rating.average.toFixed(1), icon: Star, color: "text-amber-400" },
                  { label: "Reviews", value: rating.count, icon: MessageCircle, color: "text-slate-400" },
                  { label: "Tours", value: tours.length, icon: Compass, color: "text-slate-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white px-5 py-2.5 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-sm font-bold">{stat.value}</span>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
               <Button 
                onClick={() => setShowContactModal(true)}
                className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-slate-200 transition-all border-none"
               >
                  <MessageCircle className="h-4 w-4 mr-2" /> Contact Guide
               </Button>
               
               {/* --- Dynamic Wishlist & Share Buttons --- */}
               <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl border-slate-200" 
                    onClick={handleToggleWishlist}
                    disabled={isWishlisting}
                  >
                    {isWishlisting ? (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    ) : (
                      <Heart className={`h-4 w-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl border-slate-200"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 text-slate-400" />
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 📦 MAIN CONTENT --- */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Biography</h3>
                  <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                    {guide?.bio || `I am ${guide?.name}, a dedicated guide passionate about sharing the heritage of Bangladesh.`}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">Dialects</h4>
                  <div className="flex flex-wrap gap-2">
                    {guide?.languages?.length > 0 ? guide.languages.map((lang: string, i: number) => (
                      <Badge key={i} className="bg-slate-50 text-slate-600 border-none px-3 py-1 rounded-lg font-semibold text-xs">
                        {lang}
                      </Badge>
                    )) : <span className="text-xs text-slate-400">Not specified</span>}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {guide?.expertise?.length > 0 ? guide.expertise.map((skill: string, i: number) => (
                      <Badge key={i} variant="outline" className="border-emerald-100 text-emerald-700 bg-emerald-50/30 px-3 py-1 rounded-lg font-semibold text-xs">
                        {skill}
                      </Badge>
                    )) : <span className="text-xs text-slate-400">Not specified</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden group shadow-lg shadow-emerald-200">
               <Compass className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10 rotate-12 transition-transform group-hover:rotate-0 duration-700" />
               <h4 className="font-bold mb-2">Ready for a tour?</h4>
               <p className="text-sm text-emerald-50/80 mb-6 leading-relaxed">Book a session with {guide?.name?.split(' ')[0]} and get a customized itinerary.</p>
               <Button onClick={() => setShowContactModal(true)} className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl border-none">
                  Check Availability
               </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-6 px-1">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">Hosted Experiences</h2>
                  <Link href="/explore" className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1.5">
                    Browse All <ArrowRight className="h-4 w-4" />
                  </Link>
              </div>

              <div className="space-y-6">
                {tours.length > 0 ? tours.map((tour: any) => (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.id}`}
                    className="block bg-white rounded-2xl border border-slate-200 hover:shadow-md transition group"
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-5">
                      <div className="w-full md:w-56 h-44 rounded-xl overflow-hidden shrink-0 relative">
                        <Image
                          src={tour.images?.[0] || "https://i.ibb.co/VvzYnRd/tour-placeholder.png"}
                          alt={tour.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-lg text-white text-[10px] font-bold flex items-center gap-1.5 shadow-xl uppercase">
                           <Zap className="h-3 w-3 fill-yellow-400 text-yellow-400" /> Get Points
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition">
                            {tour.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-sm text-slate-400 font-bold uppercase tracking-wider">
                            <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                            <span>{tour.city}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                          <span className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-emerald-500" />
                            {tour.duration} days
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 text-emerald-500" />
                            From 2 to 12 people
                          </span>
                          <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Partially refundable
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col justify-between md:border-l md:border-slate-50 md:pl-6">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Starting From</p>
                          <p className="text-2xl font-bold text-[#002B7F] mt-1">
                            <span className="text-sm mr-1">BDT</span> 
                            {Number(tour.tourFee || 0).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Per Person</p>
                        </div>
                        <Button className="bg-slate-900 hover:bg-emerald-600 text-white rounded-lg h-9 px-4 mt-4 md:mt-0 font-bold">
                            Details
                        </Button>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 font-bold text-slate-400">
                     No tours available right now.
                  </div>
                )}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10 px-1">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Expedition Logbook</h2>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                   <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                   <span className="text-sm font-bold">{rating.average.toFixed(1)}</span>
                </div>
              </div>

              <div className="space-y-10">
                {reviews.length > 0 ? reviews.map((review: any) => (
                  <div key={review.id} className="relative pl-6 border-l-2 border-slate-100 last:border-none last:pb-0 pb-10">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-2 border-slate-200" />
                    <div className="flex gap-4 mb-4">
                      <Avatar className="h-10 w-10 border border-slate-200">
                        <AvatarImage src={review.user?.profileImage} />
                        <AvatarFallback className="bg-slate-100 text-[10px] font-bold">{review.user?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-[15px] text-slate-800">{review.user?.name}</h4>
                            <p className="text-[11px] font-semibold text-slate-300">{new Date(review.createdAt).toLocaleDateString()}</p>
                         </div>
                         <div className="flex gap-0.5 mt-1">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                           ))}
                         </div>
                      </div>
                    </div>
                    <p className="text-slate-500 text-[14px] leading-relaxed italic pl-1">
                      "{review.comment}"
                    </p>
                  </div>
                )) : (
                  <p className="text-center text-slate-400 text-sm py-10">No reviews yet.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* --- 💬 CONTACT MODAL --- */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowContactModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Contact Details</h3>
                <button onClick={() => setShowContactModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="group p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp / Phone</p>
                      <p className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">{guide?.phone || "+880 1641801705"}</p>
                    </div>
                  </div>
                </div>
                <div className="group p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate">{guide?.email || "yeaminstudent5598@gmail.com"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-center text-xs text-slate-400 font-medium">Please mention "Guided.com" when contacting.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---
function Avatar({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`flex shrink-0 items-center justify-center rounded-full ${className}`}>{children}</div>;
}
function AvatarImage({ src }: { src?: string }) {
  return src ? <img src={src} className="h-full w-full object-cover rounded-full" /> : null;
}
function AvatarFallback({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`flex h-full w-full items-center justify-center rounded-full ${className}`}>{children}</div>;
}