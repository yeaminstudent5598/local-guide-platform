"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, ArrowRight, Award, Quote, Sparkles, Languages } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

// 1. Define Guide Interface based on Public API response
interface Guide {
  id: string;
  name: string;
  profileImage: string | null;
  bio: string | null;
  isVerified: boolean;
  languages: string[];
  expertise: string[];
  _count?: {
    reviewsReceived: number;
    listings: number;
  };
}

const TopGuides = () => {
  const { lang, t: translate } = useLanguage() as any;
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from the Public API
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await fetch("/api/v1/public/guides?limit=3");
        const result = await response.json();
        
        if (result.success) {
          setGuides(result.data);
        }
      } catch (error) {
        console.error("Error fetching public guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const labels = {
    heading: lang === "en" ? "Meet Our Elite Guides" : "আমাদের সেরা গাইডবৃন্দ",
    subHeading: lang === "en" ? "Local experts ready to show you the soul of Bangladesh." : "দক্ষ স্থানীয় গাইড যারা আপনাকে বাংলাদেশের আসল রূপ দেখাতে প্রস্তুত।",
    reviews: lang === "en" ? "Reviews" : "রিভিউ",
    tours: lang === "en" ? "Tours" : "ট্যুর",
    viewProfile: lang === "en" ? "View Profile" : "প্রোফাইল দেখুন",
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-50 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-50 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest"
          >
            <Sparkles className="h-3 w-3 fill-emerald-600" /> Professional Experts
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            {labels.heading}
          </h2>
          <p className="text-slate-500 font-medium opacity-80 max-w-xl mx-auto">
            {labels.subHeading}
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map((i) => <GuideSkeleton key={i} />)
          ) : (
            guides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/guides/${guide.id}`} className="group block h-full">
                  <Card className="h-full border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-emerald-200/30">
                    
                    {/* Top Aesthetic Header */}
                    <div className="h-28 bg-slate-900 relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-transparent" />
                       <div className="absolute -bottom-12 left-8">
                          <Avatar className="h-24 w-24 border-[5px] border-white shadow-xl bg-white">
                            <AvatarImage src={guide.profileImage || ""} className="object-cover" />
                            <AvatarFallback className="bg-emerald-50 text-emerald-700 font-black text-xl">
                              {guide.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                       </div>
                       {guide.isVerified && (
                         <div className="absolute bottom-[-40px] left-[85px] bg-emerald-500 border-4 border-white rounded-full p-1 shadow-lg z-20">
                            <Award className="h-3.5 w-3.5 text-white" />
                         </div>
                       )}
                    </div>

                    <CardContent className="pt-16 pb-8 px-8 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="min-w-0">
                          <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                            {guide.name}
                          </h3>
                          <p className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            <MapPin className="h-3 w-3 text-emerald-500" /> Bangladesh
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 shrink-0">
                           <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                           <span className="text-xs font-black text-amber-700">5.0</span>
                        </div>
                      </div>

                      <div className="relative mb-6">
                        <Quote className="absolute -top-1 -left-1 h-4 w-4 text-slate-100 rotate-180" />
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 italic pl-4 font-medium">
                          {guide.bio || "Experience the hidden soul of our beautiful homeland with curated local tours."}
                        </p>
                      </div>

                      {/* Tags Section */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {guide.expertise.slice(0, 2).map((exp, i) => (
                          <Badge key={i} variant="secondary" className="bg-slate-50 text-slate-500 border-none text-[9px] font-black uppercase py-1">
                            {exp}
                          </Badge>
                        ))}
                        {guide.languages.length > 0 && (
                          <Badge className="bg-emerald-50 text-emerald-700 border-none text-[9px] font-black uppercase py-1">
                            <Languages className="h-3 w-3 mr-1" /> {guide.languages[0]}
                          </Badge>
                        )}
                      </div>

                      {/* Dynamic Stats Footer */}
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex gap-4">
                           <div className="text-center">
                              <p className="text-lg font-black text-slate-900 leading-none">{guide._count?.reviewsReceived || 0}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{labels.reviews}</p>
                           </div>
                           <div className="w-[px] h-8 bg-slate-100" />
                           <div className="text-center">
                              <p className="text-lg font-black text-slate-900 leading-none">{guide._count?.listings || 0}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{labels.tours}</p>
                           </div>
                        </div>
                        
                        <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-emerald-600 transition-all duration-300">
                           <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

// Skeleton Loading UI
const GuideSkeleton = () => (
  <Card className="h-[450px] rounded-[2.5rem] overflow-hidden border-none shadow-xl">
    <Skeleton className="h-28 w-full" />
    <CardContent className="pt-16 px-8 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </CardContent>
  </Card>
);

export default TopGuides;