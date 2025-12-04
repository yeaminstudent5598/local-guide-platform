"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  listingId: string;
}

export default function ReviewForm({ listingId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login to submit a review");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId, rating, comment }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setComment("");
        router.refresh(); // পেজ রিফ্রেশ করে নতুন রিভিউ দেখাবে
      } else {
        throw new Error(data.message || "Failed to submit review");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Rating Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-colors"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hover || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Comment</label>
            <Textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}