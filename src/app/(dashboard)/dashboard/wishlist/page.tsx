"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Trash2, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import WishlistButton from "@/components/shared/WishlistButton";

interface WishlistItem {
  id: string;
  listing: {
    id: string;
    title: string;
    city: string;
    country: string;
    tourFee: number;
    images: string[];
    duration: number;
  };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Wishlist Items
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await fetch("/api/v1/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (data.success) {
          setItems(data.data);
        } else {
          toast.error("Failed to load wishlist");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Wishlist</h2>
        <p className="text-muted-foreground">
          Your saved tours and upcoming adventures.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-slate-50/50">
          <Heart className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">Start exploring tours and save your favorites here.</p>
          <Link href="/explore">
            <Button size="lg">Explore Tours</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative group h-full">
              <Link href={`/tours/${item.listing.id}`} className="block h-full">
                <Card className="overflow-hidden hover:shadow-lg transition-all h-full flex flex-col border-slate-200">
                  
                  {/* Image Area */}
                  <div className="relative h-48 w-full bg-slate-100">
                    <Image
                      src={item.listing.images[0] || "/placeholder.jpg"}
                      alt={item.listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Toggle Button */}
                    <div className="absolute top-2 right-2 z-10">
                        <WishlistButton listingId={item.listing.id} />
                    </div>
                  </div>

                  {/* Content Area */}
                  <CardContent className="p-4 flex-1 flex flex-col gap-2">
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.listing.city}, {item.listing.country}
                    </div>
                    
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {item.listing.title}
                    </h3>
                  </CardContent>

                  {/* Footer Area */}
                  <CardFooter className="p-4 pt-0 mt-auto border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <div className="flex items-center gap-1 text-sm text-muted-foreground pt-3">
                        <Clock className="h-4 w-4" />
                        <span>{item.listing.duration} Days</span>
                     </div>
                     <div className="pt-3">
                        <span className="text-lg font-bold text-primary">৳ {item.listing.tourFee}</span>
                     </div>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}