"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
  reviews?: any[]; // or specific review type
  _count?: { reviews: number };
}

// 2. Accept Props
interface FeaturedToursProps {
  tours: Listing[];
}

const FeaturedTours = ({ tours }: FeaturedToursProps) => {
  
  // Infinite Scroll logic for Framer Motion
  // If tours exist, double them for loop effect
  const sliderItems = tours.length > 0 ? [...tours, ...tours] : [];

  // Helper for Rating
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getRating = (reviews: any) => {
    if (!reviews || reviews.length === 0) return "New";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

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

      {tours.length === 0 ? (
        <div className="container text-center py-10 text-muted-foreground">
           No featured tours available at the moment.
        </div>
      ) : (
        /* Framer Motion Slider */
        <div className="relative w-full">
          <motion.div
            className="flex gap-8 w-max px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 40, // Speed
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {sliderItems.map((tour, index) => (
              <div 
                key={`${tour.id}-${index}`} 
                className="w-[350px] flex-shrink-0"
              >
                <Link href={`/tours/${tour.id}`}>
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group rounded-2xl h-full flex flex-col bg-white cursor-pointer">
                    
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

                    <CardContent className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center text-xs font-semibold text-primary gap-1 bg-primary/10 px-2 py-1 rounded">
                          <MapPin className="h-3 w-3" /> {tour.city}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-slate-900">{getRating(tour.reviews)}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {tour.title}
                      </h3>
                    </CardContent>

                    <CardFooter className="p-6 pt-0 flex justify-between items-center mt-auto">
                      <div>
                        <p className="text-xs text-slate-400">Starting from</p>
                        <p className="text-xl font-bold text-primary">৳ {tour.tourFee}</p>
                      </div>
                      <Button className="rounded-full px-6 shadow-md shadow-primary/20">Book Now</Button>
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