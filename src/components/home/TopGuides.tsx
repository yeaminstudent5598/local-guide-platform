"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowRight, Award, Quote } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Language Hook

// Guides Data with Translations
const guides = [
  { 
    id: 1, 
    name: "Rahim Ahmed", 
    location: { en: "Dhaka", bn: "ঢাকা" }, 
    rating: 4.9, 
    reviews: 120, 
    expertise: { en: "History", bn: "ইতিহাস" }, 
    image: "/images/men1.jpg",
    bio: { en: "Passionate about Mughal history.", bn: "মুঘল ইতিহাস সম্পর্কে আগ্রহী।" }
  },
  { 
    id: 2, 
    name: "Sarah Kabir", 
    location: { en: "Sylhet", bn: "সিলেট" }, 
    rating: 5.0, 
    reviews: 85, 
    expertise: { en: "Nature", bn: "প্রকৃতি" }, 
    image: "/images/men3.jpg",
    bio: { en: "Expert in tea gardens & waterfalls.", bn: "চা বাগান ও জলপ্রপাত বিশেষজ্ঞ।" }
  },
  { 
    id: 3, 
    name: "Tanvir Hasan", 
    location: { en: "Bandarban", bn: "বান্দরবান" }, 
    rating: 4.8, 
    reviews: 200, 
    expertise: { en: "Adventure", bn: "অ্যাডভেঞ্চার" }, 
    image: "/images/men2.jpg",
    bio: { en: "Trekking & hiking specialist.", bn: "ট্রেকিং এবং হাইকিং বিশেষজ্ঞ।" }
  },
];

const TopGuides = () => {
  const { lang } = useLanguage(); // ✅ Use Hook

  // UI Translations
  const t = {
    heading: lang === "en" ? "Top Rated Guides" : "সেরা গাইডবৃন্দ",
    subHeading: lang === "en" ? "Meet the locals who know their cities best." : "পরিচিত হোন স্থানীয় গাইডদের সাথে যারা তাদের শহরকে সবচেয়ে ভালো চেনে।",
    reviews: lang === "en" ? "Reviews" : "রিভিউ",
    viewProfile: lang === "en" ? "View Profile" : "প্রোফাইল দেখুন",
    expertIn: lang === "en" ? "Expert in" : "বিশেষজ্ঞ",
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

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

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.id}`} className="group">
              <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white rounded-2xl relative">
                
                {/* Decorative Top Bar */}
                <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 relative">
                   <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-slate-800 hover:bg-white shadow-sm backdrop-blur-sm">
                         <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" /> 
                         {guide.rating}
                      </Badge>
                   </div>
                </div>

                <CardContent className="pt-0 flex-1 flex flex-col items-center text-center px-6">
                  
                  {/* Avatar (Floating) */}
                  <div className="-mt-12 mb-4 relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                      <AvatarImage src={guide.image} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                        {guide.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Verified Icon */}
                    <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full p-1">
                       <Award className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  {/* Info */}
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                    {guide.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-4">
                    <MapPin className="h-3.5 w-3.5" /> {guide.location[lang]}
                  </div>

                  <p className="text-sm text-slate-600 italic mb-6 relative px-4">
                    <Quote className="h-3 w-3 text-slate-300 absolute -top-1 left-0 transform -scale-x-100" />
                    {guide.bio[lang]}
                    <Quote className="h-3 w-3 text-slate-300 absolute -bottom-1 right-0" />
                  </p>
                  
                  <div className="mt-auto w-full">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t.expertIn}</span>
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        {guide.expertise[lang]}
                      </Badge>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-50 w-full flex justify-between items-center text-sm">
                       <span className="text-slate-500">
                          <strong className="text-slate-900">{guide.reviews}</strong> {t.reviews}
                       </span>
                       <span className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {t.viewProfile} <ArrowRight className="h-4 w-4" />
                       </span>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TopGuides;