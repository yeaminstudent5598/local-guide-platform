"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Calendar } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  listing: {
    title: string;
    images: string[];
  };
  user: {
    name: string;
    profileImage: string;
    email: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // Decode role
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);

        const res = await fetch("/api/v1/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading reviews...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {userRole === "GUIDE" ? "Reviews Received" : "My Reviews"}
        </h2>
        <p className="text-muted-foreground">
          {userRole === "GUIDE" 
            ? "See what travelers are saying about your tours."
            : "History of reviews you have given."}
        </p>
      </div>

      {reviews.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <MessageSquare className="h-10 w-10 mb-4 opacity-20" />
            <p>No reviews found yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  
                  {/* Left: Listing Info */}
                  <div className="w-full md:w-48 shrink-0">
                    <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100 mb-2">
                      <Image 
                        src={review.listing.images[0] || "/placeholder.jpg"} 
                        alt="tour" 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <p className="text-xs font-medium text-slate-900 line-clamp-2">
                      {review.listing.title}
                    </p>
                  </div>

                  {/* Right: Review Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.user.profileImage || "/placeholder-user.jpg"} />
                          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{review.user.name}</p>
                          <p className="text-xs text-slate-500">{review.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-sm font-medium">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {review.rating}.0
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 italic leading-relaxed border border-slate-100">
                      "{review.comment}"
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(review.createdAt).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}