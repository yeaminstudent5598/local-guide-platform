"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, BadgeCheck, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Testimonials({ reviews }: { reviews: any[] }) {
  const { lang } = useLanguage();

  const t = {
    label: lang === 'en' ? "VOICES OF EXPLORERS" : "ভ্রমণকারীদের কণ্ঠস্বর",
    heading: lang === 'en' ? "Stories from the Heart of Bangladesh" : "বাংলাদেশের অভিজ্ঞতার গল্প",
    subHeading: lang === 'en' ? "Authentic reviews from our global community of travelers." : "বিশ্বজুড়ে আমাদের ভ্রমণকারীদের বাস্তব অভিজ্ঞতা।",
    verified: lang === 'en' ? "Verified Explorer" : "ভেরিফাইড এক্সপ্লোরার",
  };

  // Fallback realistic data with Emerald vibe
  const displayReviews = reviews && reviews.length > 0 ? reviews.slice(0, 3) : [
    {
      id: "1",
      comment: "Exploring the tea gardens of Sylhet with Rajib was a spiritual experience. The depth of local history he shared was unparalleled.",
      rating: 5,
      user: { name: "Sarah J. Miller", profileImage: "https://i.pravatar.cc/150?u=sarah" }
    },
    {
      id: "2",
      comment: "Vistara isn't just a booking platform; it's a gateway to the soul of Bangladesh. Seamless booking and truly professional guides.",
      rating: 5,
      user: { name: "Marcus Chen", profileImage: "https://i.pravatar.cc/150?u=marcus" }
    },
    {
      id: "3",
      comment: "I've traveled to 40 countries, and the photography tour in Old Dhaka arranged through Vistara was one of my top 5 moments ever.",
      rating: 5,
      user: { name: "Elena Rodriguez", profileImage: "https://i.pravatar.cc/150?u=elena" }
    }
  ];

  return (
    <section className="py-28 px-4 bg-[#FDFDFD] relative overflow-hidden">
      
      {/* --- Subtle Decorative Elements --- */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-emerald-50/20 -skew-x-12 translate-x-20 pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.4em]"
          >
             <div className="h-0.5 w-8 bg-emerald-600 rounded-full" />
             {t.label}
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            {t.heading}
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto italic">
            {t.subHeading}
          </p>
        </div>

        {/* --- Testimonial Cards Grid --- */}
        <div className="grid md:grid-cols-3 gap-8">
          {displayReviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="flex"
            >
              <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 flex flex-col group">
                
                {/* Visual Accent */}
                <div className="absolute top-8 right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Quote className="h-20 w-20 text-emerald-900" />
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, starI) => (
                    <Star 
                      key={starI} 
                      className={`h-3.5 w-3.5 ${starI < review.rating ? 'fill-emerald-500 text-emerald-500' : 'text-slate-100'}`} 
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-600 text-lg leading-relaxed font-medium mb-10 flex-1">
                  "{review.comment}"
                </p>
                
                {/* Author Info */}
                <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-emerald-50 shadow-sm rounded-2xl overflow-hidden">
                      <AvatarImage src={review.user?.profileImage} className="object-cover" />
                      <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">{review.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white">
                        <BadgeCheck className="h-3 w-3" />
                    </div>
                  </div>
                  
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{review.user?.name}</h4>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1 mt-0.5">
                      {t.verified}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Bottom Trust Bar --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale"
        >
           <div className="flex items-center gap-2 font-bold text-slate-400"><MessageSquare className="h-5 w-5" /> TRUSTPILOT</div>
           <div className="flex items-center gap-2 font-bold text-slate-400"><Star className="h-5 w-5" /> GOOGLE REVIEWS</div>
           <div className="flex items-center gap-2 font-bold text-slate-400"><BadgeCheck className="h-5 w-5" /> TRIPADVISOR</div>
        </motion.div>

      </div>
    </section>
  );
}