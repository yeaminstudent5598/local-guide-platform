"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Calendar, MapPin, Sparkles, Search } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider"; 
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string; 
  listing: {
    title: string;
    images: string[];
    city?: string;
  };
  user: {
    name: string;
    profileImage?: string;
    email: string;
  };
}

interface ReviewsClientProps {
  reviews: Review[];
  userRole: string;
}

export default function ReviewsClient({ reviews, userRole }: ReviewsClientProps) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true); // ✅ Loading State for Requirement 10

  // --- 🔄 Simulation for Skeleton Loader [Requirement 10] ---
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Translations
  const t = {
    title: userRole === "GUIDE" 
      ? (lang === 'en' ? "Customer Feedback" : "ক্রেতাদের মতামত")
      : (lang === 'en' ? "My Contributions" : "আমার রিভিউসমূহ"),
    desc: userRole === "GUIDE"
      ? (lang === 'en' ? "Manage and analyze feedback from your tourists." : "আপনার ট্যুরিস্টদের থেকে পাওয়া ফিডব্যাক পরিচালনা করুন।")
      : (lang === 'en' ? "Review history of your authentic journeys." : "আপনার করা ভ্রমণের অভিজ্ঞতাসমূহ।"),
    noReviews: lang === 'en' ? "No feedback found in registry." : "এখনও কোনো রিভিউ রেকর্ড পাওয়া যায়নি।",
    headers: {
      tour: lang === 'en' ? "Tour Identity" : "ট্যুর তথ্য",
      reviewer: lang === 'en' ? "Partner" : "ব্যবহারকারী",
      rating: lang === 'en' ? "Rating" : "রেটিং",
      comment: lang === 'en' ? "Testimonial" : "মন্তব্য",
      date: lang === 'en' ? "Timestamp" : "তারিখ",
    }
  };

  // ✅ Show Skeleton Loader while loading [Requirement 10]
  if (loading) return <ReviewsSkeleton />;

  return (
    <div className="space-y-8 p-4 md:p-8 bg-[#F8FAFB] min-h-screen animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
               <Sparkles className="h-3 w-3" /> Quality Assurance
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">{t.title}</h2>
          <p className="text-sm font-medium text-slate-500 italic mt-1">{t.desc}</p>
        </div>
        <Badge variant="outline" className="bg-white border-slate-100 px-4 py-2 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-slate-400">
           Verified Records: {reviews.length}
        </Badge>
      </div>

      {reviews.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-white/50 rounded-[2.5rem]">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                <Search className="h-10 w-10 text-slate-200" />
            </div>
            <p className="text-slate-500 font-bold italic">{t.noReviews}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* ✅ 1. DESKTOP VIEW (Luxury Table) */}
          <div className="hidden md:block">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-50">
                    <TableHead className="pl-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.tour}</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.reviewer}</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.rating}</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.comment}</TableHead>
                    <TableHead className="text-right pr-10 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.date}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id} className="group hover:bg-slate-50/50 transition-all border-slate-50 align-top">
                      {/* Tour Info */}
                      <TableCell className="pl-10 py-6">
                        <div className="flex items-start gap-4">
                          <div className="relative h-14 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                            <Image src={review.listing.images[0] || "/placeholder.jpg"} alt="tour" fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                             <p className="font-bold text-slate-900 line-clamp-2 text-sm leading-snug group-hover:text-emerald-600 transition-colors">
                               {review.listing.title}
                             </p>
                             {review.listing.city && (
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3 text-emerald-500" /> {review.listing.city}
                               </span>
                             )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Reviewer */}
                      <TableCell className="py-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={review.user.profileImage || undefined} />
                            <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">{review.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-900">{review.user.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px]">{review.user.email}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Rating */}
                      <TableCell className="py-6">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1 flex w-fit items-center gap-1 font-black text-[10px]">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {review.rating}.0
                        </Badge>
                      </TableCell>

                      {/* Comment */}
                      <TableCell className="py-6">
                        <p className="text-sm text-slate-600 italic font-medium leading-relaxed max-w-[300px] line-clamp-3">
                          "{review.comment}"
                        </p>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-right pr-10 py-6">
                        <div className="text-[10px] font-black text-slate-400 uppercase flex items-center justify-end gap-1.5 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* ✅ 2. MOBILE VIEW (Luxury Cards) */}
          <div className="md:hidden space-y-5 pb-10">
            {reviews.map((review) => (
              <Card key={review.id} className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden group">
                <CardContent className="p-6 space-y-5">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src={review.user.profileImage || undefined} />
                            <AvatarFallback className="bg-slate-100 text-xs font-bold">{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                           <h4 className="text-sm font-black text-slate-900">{review.user.name}</h4>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-2 py-1 flex items-center gap-1 font-black text-[10px]">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {review.rating}.0
                      </Badge>
                   </div>

                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic shadow-inner">
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                         "{review.comment}"
                      </p>
                   </div>

                   <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                      <div className="relative h-12 w-16 rounded-xl bg-slate-200 shrink-0 overflow-hidden border border-white shadow-sm">
                         <Image src={review.listing.images[0] || "/placeholder.jpg"} alt="tour" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                         <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Experience</p>
                         <p className="text-xs font-bold text-slate-900 truncate leading-tight">{review.listing.title}</p>
                      </div>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- 🦴 Requirement 10: Skeleton Component ---
function ReviewsSkeleton() {
  return (
    <div className="p-10 space-y-10 animate-pulse bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end border-b border-slate-100 pb-8">
        <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-8 w-40 bg-white rounded-2xl shadow-sm" />
      </div>
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
        <div className="h-20 bg-slate-50" />
        <div className="space-y-0">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-start justify-between p-10 border-b border-slate-50">
              <div className="flex gap-4">
                  <div className="h-14 w-20 rounded-xl bg-slate-100" />
                  <div className="space-y-2"><div className="h-4 w-40 bg-slate-100 rounded" /><div className="h-3 w-20 bg-slate-50 rounded" /></div>
              </div>
              <div className="flex gap-3"><div className="h-10 w-10 rounded-full bg-slate-100" /><div className="h-4 w-24 bg-slate-100 rounded" /></div>
              <div className="h-6 w-20 bg-slate-100 rounded-full" />
              <div className="h-4 w-48 bg-slate-100 rounded" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}