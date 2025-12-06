"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Calendar, MapPin, User } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider"; 

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string; 
  listing: {
    title: string;
    images: string[];
    city?: string;
  };
  user: {
    name: string;
    profileImage?: string;
    email: string;
  };
}

interface ReviewsClientProps {
  reviews: Review[];
  userRole: string;
}

export default function ReviewsClient({ reviews, userRole }: ReviewsClientProps) {
  const { lang } = useLanguage();

  // Translations
  const t = {
    title: userRole === "GUIDE" 
      ? (lang === 'en' ? "Reviews Received" : "প্রাপ্ত রিভিউ")
      : (lang === 'en' ? "My Reviews" : "আমার রিভিউ"),
    desc: userRole === "GUIDE"
      ? (lang === 'en' ? "Feedback from your tourists." : "আপনার ট্যুরিস্টদের মতামত।")
      : (lang === 'en' ? "Feedback you gave to guides." : "আপনি যেসব রিভিউ দিয়েছেন।"),
    noReviews: lang === 'en' ? "No reviews found yet." : "এখনও কোনো রিভিউ পাওয়া যায়নি।",
    headers: {
      tour: lang === 'en' ? "Tour Details" : "ট্যুর বিবরণ",
      reviewer: lang === 'en' ? "User" : "ব্যবহারকারী",
      rating: lang === 'en' ? "Rating" : "রেটিং",
      comment: lang === 'en' ? "Comment" : "মন্তব্য",
      date: lang === 'en' ? "Date" : "তারিখ",
    }
  };

  return (
    <div className="space-y-6 p-2 md:p-4">
      
      {/* Page Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{t.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
      </div>

      {reviews.length === 0 ? (
        <Card className="border-dashed border-2 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p>{t.noReviews}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* ✅ 1. DESKTOP VIEW (Table) - Hidden on Mobile */}
          <Card className="hidden md:block shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="pl-6 w-[300px]">{t.headers.tour}</TableHead>
                    <TableHead className="w-[200px]">{t.headers.reviewer}</TableHead>
                    <TableHead className="w-[100px]">{t.headers.rating}</TableHead>
                    <TableHead>{t.headers.comment}</TableHead>
                    <TableHead className="text-right pr-6">{t.headers.date}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id} className="group hover:bg-slate-50/30 transition-colors align-top">
                      
                      {/* Tour Info */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="relative h-12 w-16 rounded-md overflow-hidden bg-slate-200 shrink-0 border border-slate-100">
                            <Image 
                              src={review.listing.images[0] || "/placeholder.jpg"} 
                              alt="tour" 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div>
                             <p className="text-sm font-medium text-slate-900 line-clamp-2 leading-tight mb-1">
                               {review.listing.title}
                             </p>
                             {review.listing.city && (
                               <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {review.listing.city}
                               </span>
                             )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Reviewer Info */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border border-slate-100">
                            <AvatarImage src={review.user.profileImage || undefined} />
                            <AvatarFallback className="bg-slate-100 text-xs text-slate-600">{review.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900">{review.user.name}</span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{review.user.email}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Rating */}
                      <TableCell>
                        <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 px-2 py-0.5 flex w-fit items-center gap-1 font-bold">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {review.rating}.0
                        </Badge>
                      </TableCell>

                      {/* Comment */}
                      <TableCell>
                        <p className="text-sm text-slate-600 italic leading-relaxed line-clamp-2" title={review.comment}>
                          "{review.comment}"
                        </p>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ✅ 2. MOBILE VIEW (Cards) - Visible only on Mobile */}
          <div className="md:hidden space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="shadow-sm border-slate-200 overflow-hidden">
                <CardContent className="p-4 space-y-4">
                   
                   {/* Header: User & Rating */}
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-100">
                            <AvatarImage src={review.user.profileImage || undefined} />
                            <AvatarFallback className="bg-slate-100 text-xs">{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                           <h4 className="text-sm font-bold text-slate-900">{review.user.name}</h4>
                           <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-2 py-0.5 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="font-bold">{review.rating}.0</span>
                      </Badge>
                   </div>

                   {/* Comment Body */}
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-700 italic leading-relaxed">
                         "{review.comment}"
                      </p>
                   </div>

                   {/* Footer: Tour Info */}
                   <div className="flex items-center gap-3 pt-2 border-t border-slate-100 mt-2">
                      <div className="relative h-10 w-14 rounded bg-slate-200 shrink-0 overflow-hidden">
                         <Image src={review.listing.images[0] || "/placeholder.jpg"} alt="tour" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                         <p className="text-xs text-slate-500 uppercase font-semibold">Review for</p>
                         <p className="text-sm font-medium text-slate-900 truncate">{review.listing.title}</p>
                      </div>
                   </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}