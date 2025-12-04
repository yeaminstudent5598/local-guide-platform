// src/components/tours/ReviewSection.tsx

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/shared/FadeIn";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    profileImage?: string;
  };
}

interface ReviewSectionProps {
  listingId: string;
}

export default function ReviewSection({ listingId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    fetchReviews();
    fetchRating();
  }, [listingId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/v1/reviews?listingId=${listingId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const res = await fetch(`/api/v1/reviews/rating?listingId=${listingId}`);
      const data = await res.json();
      if (data.success) {
        setAvgRating(data.data.average);
      }
    } catch (error) {
      console.error("Failed to fetch rating", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Reviews & Ratings</CardTitle>
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-slate-500">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>No reviews yet. Be the first to review this tour!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <FadeIn key={review.id} delay={index * 0.05}>
                <motion.div
                  className="border-b border-slate-100 pb-6 last:border-0"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12 border-2 border-slate-100">
                      <AvatarImage 
                        src={review.user.profileImage || `https://ui-avatars.com/api/?name=${review.user.name}`} 
                      />
                      <AvatarFallback>
                        {review.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {review.user.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-slate-200 text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-slate-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
}