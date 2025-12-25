"use client";

import { useEffect, useState, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, MapPin, Star, Loader2, 
  Clock, Navigation, ArrowRight, Zap, X, 
  Wallet, Users, Filter, Languages 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import WishlistButton from "@/components/shared/WishlistButton";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Hook added

interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  tourFee: number;
  duration: number;
  languages?: string[];
  images: string[];
  guide: { name: string; profileImage: string };
  _count?: { reviews: number };
  reviews?: { rating: number }[];
}

function ExploreContent() {
  const { lang } = useLanguage(); // ✅ Get current language
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // --- 🌍 Translations ---
  const t = {
    terminal: lang === "en" ? "Expedition Terminal" : "অভিযান টার্মিনাল",
    title: lang === "en" ? "Available" : "প্রাপ্য",
    subtitle: lang === "en" ? "Expeditions" : "অভিযানসমূহ",
    found: lang === "en" ? `Found ${listings.length} handcrafted journeys in Bangladesh` : `বাংলাদেশে ${listings.length}টি চমৎকার ভ্রমণ খুঁজে পাওয়া গেছে`,
    filters: lang === "en" ? "Filters" : "ফিল্টারসমূহ",
    reset: lang === "en" ? "Reset" : "রিসেট",
    searchLabel: lang === "en" ? "Search" : "খুঁজুন",
    locationLabel: lang === "en" ? "Location" : "লোকেশন",
    budgetLabel: lang === "en" ? "Budget" : "বাজেট",
    noFound: lang === "en" ? "No experiences found matching your filters." : "আপনার ফিল্টারের সাথে মিল রয়েছে এমন কোনো ট্যুর পাওয়া যায়নি।",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCity) params.set("city", selectedCity);
      router.replace(`/explore?${params.toString()}`, { scroll: false });
      fetchListings();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCity, priceRange]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (selectedCity) params.append("city", selectedCity);
      if (priceRange[0] > 0) params.append("minPrice", priceRange[0].toString());
      if (priceRange[1] < 10000) params.append("maxPrice", priceRange[1].toString());

      const res = await fetch(`/api/v1/listings/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) setListings(data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRating = (reviews: any) => {
    if (!reviews || reviews.length === 0) return "New";
    const total = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      
      <div className="relative overflow-hidden bg-slate-950 pt-32 pb-12">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2070" 
            alt="header-bg" fill className="object-cover opacity-40 grayscale-[0.5]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                 <div className="h-0.5 w-8 bg-emerald-500 rounded-full" /> 
                 {t.terminal}
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none drop-shadow-md">
                {t.title} <span className="text-emerald-500 italic font-serif">{t.subtitle}</span>
              </h1>
              <p className="text-slate-300 text-sm font-medium italic opacity-80">
                {loading ? "Discovering routes..." : t.found}
              </p>
            </div>
            <AnimatePresence>
              {selectedCity && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-[10px] uppercase backdrop-blur-md shadow-xl">
                    {selectedCity} <X className="h-3.5 w-3.5 cursor-pointer hover:text-white" onClick={() => setSelectedCity("")} />
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
                   <Filter className="h-4 w-4 text-emerald-600" /> {t.filters}
                </h3>
                <button onClick={() => {setSearchTerm(""); setSelectedCity(""); setPriceRange([0, 10000]);}} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase">{t.reset}</button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">{t.searchLabel}</label>
                  <Input placeholder="..." className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">{t.locationLabel}</label>
                  <Input placeholder="..." className="h-10 bg-slate-50 border-slate-200 rounded-lg text-sm" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} />
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center"><label className="text-[10px] font-bold uppercase text-slate-400">{t.budgetLabel}</label><span className="text-xs font-bold text-emerald-600">৳{priceRange[1]}</span></div>
                  <Slider defaultValue={[0, 10000]} max={10000} step={500} value={priceRange} onValueChange={(val) => setPriceRange(val)} className="py-2" />
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-44 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                  ))}
                </div>
              ) : listings.length > 0 ? (
                <div className="space-y-4">
                  {listings.map((tour, i) => (
                    <TourCard key={tour.id} tour={tour} i={i} getRating={getRating} lang={lang} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
                  <Navigation className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-slate-500 font-medium">{t.noFound}</p>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// --- 📦 TourCard ---
const TourCard = ({ tour, i, getRating, lang }: any) => {
  const cardT = {
    day: lang === "en" ? "Days" : "দিন",
    points: lang === "en" ? "Get Points" : "পয়েন্ট জিতুন",
    from: lang === "en" ? "From" : "থেকে",
    max: lang === "en" ? "Max 12 People" : "সর্বোচ্চ ১২ জন",
    refund: lang === "en" ? "Refundable" : "রিফান্ডযোগ্য",
    by: lang === "en" ? "By" : "পরিচালক",
    details: lang === "en" ? "Details" : "বিস্তারিত"
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
      <Link href={`/tours/${tour.id}`} className="group block">
        <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-300">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="relative w-full ml-6 md:w-64 shrink-0 py-4">
              <div className="relative h-56 md:h-full w-full">
                <Image src={tour.images?.[0] || "/placeholder.jpg"} alt={tour.title} fill className="object-cover rounded-2xl" priority />
                <div className="absolute top-2 left-2">
                  <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase shadow">
                    {tour.duration} {cardT.day}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase text-white shadow">
                    <Zap className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {cardT.points}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400">
                      <MapPin className="h-3 w-3 text-emerald-500" /> {tour.city}
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{tour.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-bold uppercase text-slate-400">{cardT.from}</p>
                    <p className="text-lg md:text-xl font-bold text-[#002B7F] leading-none">৳{tour.tourFee?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-emerald-500" /> {tour.duration} {cardT.day}</div>
                  <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-emerald-500" /> {cardT.max}</div>
                  <div className="flex items-center gap-1.5"><Languages className="h-4 w-4 text-emerald-500" /> {tour.languages && tour.languages.length > 0 ? tour.languages.join(", ") : "Bangla, English"}</div>
                  <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700"><Wallet className="h-4 w-4" /> {cardT.refund}</div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 rounded border border-amber-100 bg-amber-50 px-1.5 py-0.5">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-700">{getRating(tour.reviews)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6 overflow-hidden rounded-full border border-slate-100"><Image src={tour.guide?.profileImage || "https://i.ibb.co/5GzXkwq/user-placeholder.png"} alt="guide" fill className="object-cover" /></div>
                    <span className="text-[10px] font-bold text-slate-500">{cardT.by} {tour.guide?.name?.split(" ")[0]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-slate-50 p-1.5 hover:bg-white transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <WishlistButton listingId={tour.id} />
                  </div>
                  <Button className="h-9 rounded-lg bg-slate-950 px-4 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-emerald-600 transition-colors">
                    {cardT.details} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600"/></div>}>
      <ExploreContent />
    </Suspense>
  );
}