"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Language Hook

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Testimonials({ reviews }: { reviews: any[] }) {
  const { lang } = useLanguage(); // Use Hook

  // Translations
  const t = {
    heading: lang === 'en' ? "What Travelers Say" : "ভ্রমণকারীদের মতামত",
    subHeading: lang === 'en' ? "Real stories from real travelers." : "ভ্রমণকারীদের বাস্তব অভিজ্ঞতা।",
    verified: lang === 'en' ? "Verified Traveler" : "ভেরিফাইড ট্রাভেলার",
  };

  // Fallback content if no reviews exist
  const displayReviews = reviews.length > 0 ? reviews.slice(0, 3) : [
    {
      id: "1",
      comment: "This was the best experience of my life! The guide was so knowledgeable and friendly. Highly recommended!",
      rating: 5,
      user: { name: "Sarah Jenkins", profileImage: "https://i.pravatar.cc/150?u=a042581f4e29026024d" }
    },
    {
      id: "2",
      comment: "Vistara made my trip to Bangladesh unforgettable. The booking process was seamless and secure.",
      rating: 5,
      user: { name: "Michael Chen", profileImage: "https://i.pravatar.cc/150?u=a042581f4e29026704d" }
    },
    {
      id: "3",
      comment: "I loved the authentic local food tour. It felt like visiting a friend rather than a paid tour.",
      rating: 4,
      user: { name: "Ayesha Khan", profileImage: "https://i.pravatar.cc/150?u=a04258114e29026302d" }
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
           <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
             {t.heading}
           </h2>
           <p className="text-lg text-slate-500">
             {t.subHeading}
           </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {displayReviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden group">
                <div className="h-2 w-full bg-gradient-to-r from-primary/40 to-primary/10"></div>
                <CardContent className="p-8 flex flex-col h-full">
                  
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <Quote className="h-10 w-10 text-primary/20 group-hover:text-primary/40 transition-colors" />
                  </div>

                  {/* Comment */}
                  <p className="text-slate-600 italic mb-8 leading-relaxed text-lg flex-1">
                    "{review.comment}"
                  </p>
                  
                  {/* Footer Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                     <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src={review.user?.profileImage || `https://ui-avatars.com/api/?name=${review.user?.name}`} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{review.user?.name?.[0]}</AvatarFallback>
                     </Avatar>
                     <div>
                        <div className="font-bold text-slate-900">{review.user?.name}</div>
                        <div className="text-xs text-primary font-medium flex items-center gap-1">
                          {t.verified}
                          {/* Star Rating if available */}
                          {review.rating && (
                             <span className="text-slate-300 mx-1">•</span> 
                          )}
                          {review.rating && (
                             <div className="flex">
                               {[...Array(review.rating)].map((_, starI) => (
                                  <Star key={starI} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                               ))}
                             </div>
                          )}
                        </div>
                     </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}