// src/components/home/Testimonials.tsx

"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { FadeIn } from "../shared/FadeIn";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    name: string;
    profileImage?: string;
  };
  listing: {
    title: string;
    city: string;
  };
}

interface TestimonialsProps {
  reviews: Review[];
}

export default function Testimonials({ reviews }: TestimonialsProps) {
  // Fallback data if no reviews
  const displayReviews = reviews.length > 0 ? reviews.slice(0, 6) : [
    {
      id: "1",
      rating: 5,
      comment: "This was the best experience of my life! The guide was so knowledgeable and friendly.",
      user: { name: "Sarah Jenkins", profileImage: "/images/men3.jpg" },
      listing: { title: "Food Tour", city: "Dhaka" }
    },
    {
      id: "2",
      rating: 5,
      comment: "Vistara made my trip to Bangladesh unforgettable. Highly recommended!",
      user: { name: "Michael Chen", profileImage: "/images/men2.jpg" },
      listing: { title: "Heritage Walk", city: "Sylhet" }
    },
    {
      id: "3",
      rating: 4,
      comment: "Safe, secure, and super easy to book. I loved the local food tour.",
      user: { name: "Ayesha Khan", profileImage: "/images/men1.jpg" },
      listing: { title: "Street Food Adventure", city: "Chittagong" }
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="container">
        
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Loved by Travelers
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Hear from adventurers who explored with our local guides
          </p>
        </FadeIn>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayReviews.map((review, index) => (
            <FadeIn key={review.id} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-8 h-full flex flex-col border-slate-100 shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                  
                  {/* Quote Icon Background */}
                  <div className="absolute -top-4 -right-4 opacity-5">
                    <Quote className="h-32 w-32 text-primary" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-6 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-slate-700 text-lg leading-relaxed mb-6 flex-1 italic relative z-10">
                    "{review.comment}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 relative z-10">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage 
                        src={review.user.profileImage || `https://ui-avatars.com/api/?name=${review.user.name}`} 
                      />
                      <AvatarFallback>
                        {review.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-slate-900">
                        {review.user.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {review.listing.title} • {review.listing.city}
                      </div>
                    </div>
                  </div>

                </Card>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          className="mt-20 bg-slate-900 rounded-3xl p-12 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "4.9/5", label: "Average Rating" },
              { value: "12,000+", label: "Happy Travelers" },
              { value: "500+", label: "Expert Guides" },
              { value: "50+", label: "Cities Covered" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}