"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

// 1. Define Interface
interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  tourFee: number;
  duration: number;
  images: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviews?: any[]; 
  _count?: { reviews: number };
}

// 2. Accept Props
interface FeaturedToursProps {
  tours: Listing[];
}

const FeaturedTours = ({ tours }: FeaturedToursProps) => {
  const { lang } = useLanguage();

  // Infinite Scroll Logic
  const sliderItems = tours.length > 0 ? [...tours, ...tours] : [];

  // Helper for Rating
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getRating = (reviews: any) => {
    if (!reviews || reviews.length === 0) return "New";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // Translations
  const t = {
    heading: lang === 'en' ? "Featured Experiences" : "জনপ্রিয় অভিজ্ঞতা",
    subHeading: lang === 'en' ? "Top picks for your next adventure." : "আপনার পরবর্তী অ্যাডভেঞ্চারের জন্য সেরা বাছাই।",
    viewAll: lang === 'en' ? "View All" : "সব দেখুন",
    days: lang === 'en' ? "Days" : "দিন",
    startingFrom: lang === 'en' ? "Starting from" : "শুরু হচ্ছে",
    bookNow: lang === 'en' ? "Book Now" : "বুক করুন",
    noTours: lang === 'en' ? "No featured tours available at the moment." : "এই মুহূর্তে কোনো জনপ্রিয় ট্যুর নেই।",
  };

  return (
    <section className="py-12 md:py-20 bg-slate-50 overflow-hidden">
      <div className="container mb-8 md:mb-10 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">{t.heading}</h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">{t.subHeading}</p>
          </div>
          <Link href="/explore">
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 pl-0 sm:pl-4">
              {t.viewAll} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {tours.length === 0 ? (
        <div className="container text-center py-10 text-muted-foreground bg-white rounded-xl border border-dashed mx-4 w-auto">
           {t.noTours}
        </div>
      ) : (
        /* Framer Motion Slider Container */
        <div className="relative w-full">
          {/* Side Fade Effects */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-4 md:gap-8 w-max px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 40, // Speed (Adjust if needed)
            }}
            whileHover={{ animationPlayState: "paused" }}
            whileTap={{ animationPlayState: "paused" }}
          >
            {sliderItems.map((tour, index) => (
              <div 
                key={`${tour.id}-${index}`} 
                // Responsive Width: Mobile 280px, Desktop 350px
                className="w-[280px] md:w-[350px] flex-shrink-0"
              >
                <Link href={`/tours/${tour.id}`}>
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group rounded-2xl h-full flex flex-col bg-white cursor-pointer">
                    
                    {/* Image Area */}
                    <div className="relative h-48 md:h-56 w-full overflow-hidden">
                      <Image 
                        src={tour.images[0] || "/placeholder.jpg"} 
                        alt={tour.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
                      
                      <Badge className="absolute top-3 left-3 md:top-4 md:left-4 bg-white/90 text-slate-900 hover:bg-white shadow-sm font-bold px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm">
                        {tour.duration} {t.days}
                      </Badge>
                    </div>

                    <CardContent className="p-4 md:p-6 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center text-[10px] md:text-xs font-semibold text-primary gap-1 bg-primary/10 px-2 py-1 rounded max-w-[70%] truncate">
                          <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{tour.city}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs md:text-sm font-bold text-slate-900">{getRating(tour.reviews)}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {tour.title}
                      </h3>
                    </CardContent>

                    <CardFooter className="p-4 md:p-6 pt-0 flex justify-between items-center mt-auto">
                      <div>
                        <p className="text-[10px] md:text-xs text-slate-400">{t.startingFrom}</p>
                        <p className="text-lg md:text-xl font-bold text-primary">৳ {tour.tourFee}</p>
                      </div>
                      <Button className="rounded-full px-4 md:px-6 h-8 md:h-10 text-xs md:text-sm shadow-md shadow-primary/20">
                        {t.bookNow}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default FeaturedTours;