"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Testimonials({ reviews }: { reviews: any[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-extrabold text-slate-900">What Travelers Say</h2>
           <p className="text-slate-500 mt-2">Real stories from real travelers.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((review, i) => (
            <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-all bg-slate-50/50">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-slate-700 italic mb-6 leading-relaxed line-clamp-4">
                  "{review.comment}"
                </p>
                
                <div className="flex items-center gap-3">
                   <Avatar>
                      <AvatarImage src={review.user?.profileImage || "/placeholder-user.jpg"} />
                      <AvatarFallback>{review.user?.name?.[0]}</AvatarFallback>
                   </Avatar>
                   <div>
                      <div className="font-bold text-slate-900">{review.user?.name}</div>
                      <div className="text-xs text-slate-500">Verified Traveler</div>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}