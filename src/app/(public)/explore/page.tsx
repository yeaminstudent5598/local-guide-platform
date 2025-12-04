"use client";

import { useEffect, useState, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Filter, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import WishlistButton from "@/components/shared/WishlistButton";
import { useSearchParams, useRouter } from "next/navigation";

interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  tourFee: number;
  duration: number;
  images: string[];
  guide: { name: string; profileImage: string };
  _count?: { reviews: number };
}

function ExploreContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial State from URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");

  // Update URL on filter change (Optional: for shareable links)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCity) params.set("city", selectedCity);
    router.push(`/explore?${params.toString()}`, { scroll: false });
  }, [searchTerm, selectedCity, router]);

  // Debounce Fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, priceRange, selectedCity]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (selectedCity) params.append("city", selectedCity);
      if (priceRange[0] > 0) params.append("minPrice", priceRange[0].toString());
      if (priceRange[1] < 10000) params.append("maxPrice", priceRange[1].toString());

      const res = await fetch(`/api/v1/listings?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setListings(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8 border-b pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Explore Tours</h1>
          <p className="text-slate-500 mt-2">Discover {listings.length} experiences available for you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 font-bold text-lg mb-6 text-slate-900 border-b pb-4">
              <SlidersHorizontal className="h-5 w-5" /> Filters
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search destination..."
                    className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">City</label>
                <Input
                  placeholder="e.g. Dhaka"
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Price Range</label>
                  <span className="text-xs font-medium text-primary">৳{priceRange[0]} - ৳{priceRange[1]}+</span>
                </div>
                <Slider
                  defaultValue={[0, 10000]}
                  max={10000}
                  step={500}
                  value={priceRange}
                  onValueChange={(val) => setPriceRange(val)}
                  className="py-2"
                />
              </div>

              <Button
                variant="outline"
                className="w-full border-slate-200 hover:bg-slate-50 text-slate-600"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCity("");
                  setPriceRange([0, 10000]);
                }}
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-[380px] bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((tour) => (
                <div key={tour.id} className="relative group">
                  <Link href={`/tours/${tour.id}`} className="block h-full">
                    <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border-slate-100 rounded-2xl">

                      {/* Image Area */}
                      <div className="relative h-52 w-full bg-slate-200 overflow-hidden">
                        <Image
                          src={tour.images[0] || "/placeholder.jpg"}
                          alt={tour.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                        <Badge className="absolute top-3 left-3 bg-white/95 text-slate-900 hover:bg-white backdrop-blur-md shadow-sm font-semibold">
                          {tour.duration} Days
                        </Badge>

                        <div className="absolute bottom-3 left-3 text-white flex items-center gap-1 text-xs font-medium">
                          <MapPin className="h-3 w-3" /> {tour.city}, {tour.country}
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg leading-tight line-clamp-2 text-slate-900 group-hover:text-primary transition-colors">
                            {tour.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 mb-4">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-slate-900">4.8</span>
                          <span className="text-xs text-slate-500">(12 reviews)</span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative h-6 w-6 rounded-full overflow-hidden bg-slate-200">
                              <Image src={tour.guide?.profileImage || "/placeholder-user.jpg"} alt="guide" fill className="object-cover" />
                            </div>
                            <span className="text-xs text-slate-500 truncate max-w-[80px]">By {tour.guide?.name}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 mr-1">from</span>
                            <span className="text-lg font-bold text-primary">৳{tour.tourFee}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Wishlist Button */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-0.5 hover:bg-white transition-colors">
                      <WishlistButton listingId={tour.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No tours found</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">We couldn't find any tours matching your filters. Try adjusting your search.</p>
              <Button
                variant="link"
                className="mt-4 text-primary"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCity("");
                  setPriceRange([0, 10000]);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Page with Suspense
export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}