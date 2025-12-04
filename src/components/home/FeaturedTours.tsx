"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Listing Interface (API Data Structure)
interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  tourFee: number;
  rating?: number;
  reviews?: any[];
  duration: number;
  images: string[];
}

const FeaturedTours = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/v1/listings");
        const data = await res.json();
        if (data.success) {
          // আমরা প্রথম ৬টি লিস্টিং দেখাবো স্লাইডারে
          setListings(data.data.slice(0, 6));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // 2. Duplicate Data for Infinite Loop Effect
  // (লিস্ট ছোট হলে স্লাইডার স্মুথ হবে না, তাই ডুপ্লিকেট করা হলো)
  const sliderItems = [...listings, ...listings];

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mb-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Experiences</h2>
            <p className="text-slate-500 mt-2">Top picks for your next adventure.</p>
          </div>
          <Link href="/explore">
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        /* 3. Framer Motion Slider Container */
        <div className="relative w-full">
          <motion.div
            className="flex gap-8 w-max px-4"
            // Animation Settings
            animate={{ x: ["0%", "-50%"] }} // Move halfway (since we doubled the list)
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30, // স্পিড কন্ট্রোল করুন (যত বেশি, তত স্লো)
            }}
            // Hover করলে যাতে স্লাইডার থামে (UX এর জন্য জরুরি)
            whileHover={{ animationPlayState: "paused" }}
          >
            {sliderItems.map((tour, index) => (
              <div 
                key={`${tour.id}-${index}`} 
                className="w-[350px] flex-shrink-0" // কার্ডের ফিক্সড উইডথ
              >
                <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group rounded-2xl h-full flex flex-col bg-white">
                  
                  {/* Image Section */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image 
                      src={tour.images[0] || "/placeholder.jpg"} 
                      alt={tour.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900 hover:bg-white shadow-sm font-bold px-3 py-1">
                      {tour.duration} Days
                    </Badge>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center text-xs font-semibold text-primary gap-1 bg-primary/10 px-2 py-1 rounded">
                        <MapPin className="h-3 w-3" /> {tour.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-slate-900">4.8</span>
                        <span className="text-xs text-slate-400">({tour.reviews?.length || 0})</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {tour.title}
                    </h3>
                  </CardContent>

                  {/* Footer Section */}
                  <CardFooter className="p-6 pt-0 flex justify-between items-center mt-auto">
                    <div>
                      <p className="text-xs text-slate-400">Starting from</p>
                      <p className="text-xl font-bold text-primary">৳ {tour.tourFee}</p>
                    </div>
                    <Link href={`/tours/${tour.id}`}>
                      <Button className="rounded-full px-6 shadow-md shadow-primary/20">Book Now</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default FeaturedTours;