"use client";

import { Card } from "@/components/ui/card";
import { Star, MapPin, ArrowRight, Clock, Heart, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  tourFee: number;
  duration: number;
  images: string[];
  reviews?: { rating: number }[]; // রিভিউ অবজেক্টের অ্যারে
  _count?: { reviews: number };  // টোটাল রিভিউ সংখ্যা
}

interface FeaturedToursProps {
  tours: Listing[];
}

const FeaturedTours = ({ tours }: FeaturedToursProps) => {
  const { lang, t } = useLanguage() as any;

  // --- রেটিং ক্যালকুলেট করার ডাইনামিক ফাংশন ---
  const calculateRating = (tour: Listing) => {
    if (!tour.reviews || tour.reviews.length === 0) {
      return { avg: "5.0", count: 0 };
    }
    const total = tour.reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (total / tour.reviews.length).toFixed(1);
    const count = tour._count?.reviews || tour.reviews.length;
    return { avg, count };
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* --- Section Header --- */}
        <div className="flex flex-row justify-between items-center mb-8 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {t?.nav?.popularSpots || (lang === 'bn' ? "জনপ্রিয় অভিজ্ঞতা" : "Popular Experiences")}
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium">
              {t?.nav?.promoDesc || (lang === 'bn' ? "সেরা ট্যুরগুলো আপনার জন্য।" : "Handpicked journeys for you.") }
            </p>
          </div>
          <Link href="/explore" className="group flex items-center gap-2 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-all">
            {t?.nav?.viewAll || (lang === 'bn' ? "সব দেখুন" : "View All")} 
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
               <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {/* --- Dynamic Editorial Grid --- */}
        {tours.length === 0 ? (
          <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed font-bold">
             {lang === 'bn' ? "এই মুহূর্তে কোনো ট্যুর নেই।" : "No tours available right now."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-6">
            {tours.slice(0, 4).map((tour, index) => {
              const { avg, count } = calculateRating(tour);
              
              return (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/tours/${tour.id}`} className="block group">
                    <Card className="h-full border-none shadow-none bg-transparent overflow-hidden">
                      
                      {/* Image Area */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-2">
                        <Image 
                          src={tour.images[0] || "https://i.ibb.co/VvzYnRd/tour-placeholder.png"} 
                          alt={tour.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Dynamic Rating Badge */}
                        <div className="absolute top-3 left-3 z-20">
                          <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-black text-slate-900">{avg}</span>
                            <span className="text-[9px] text-slate-400 font-bold">({count})</span>
                          </div>
                        </div>

                        <button className="absolute top-3 right-3 h-8 w-8 bg-black/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-rose-500 hover:border-rose-500 transition-all">
                          <Heart className="h-4 w-4" />
                        </button>

                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                           <div className="flex items-center gap-1 text-emerald-700 font-bold text-[10px] uppercase tracking-wider">
                             <MapPin className="h-3 w-3" /> {tour.city}
                           </div>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="px-1 space-y-2">
                        <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                           <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {tour.duration} {t?.nav?.days || (lang === 'bn' ? "দিন" : "Days")}</span>
                           <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 2-10 Guests</span>
                        </div>

                        <h3 className="text-[16px] font-bold text-slate-900 leading-snug line-clamp-2 min-h-[44px] group-hover:text-emerald-600 transition-colors">
                          {tour.title}
                        </h3>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-baseline gap-1">
                             <span className="text-xs font-bold text-slate-400">{lang === 'bn' ? "থেকে" : "From"}</span>
                             <span className="text-lg font-black text-slate-900 tracking-tight">৳{tour.tourFee.toLocaleString()}</span>
                          </div>
                          <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                             Instant Booking
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTours;