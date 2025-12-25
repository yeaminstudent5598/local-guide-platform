"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import WishlistButton from "@/components/shared/WishlistButton";
import { toast } from "sonner";

interface TourActionButtonsProps {
  tourId: string;
  tourTitle: string;
}

export default function TourActionButtons({ tourId, tourTitle }: TourActionButtonsProps) {
  
  // --- 📤 Share Journey Logic ---
  const handleShare = async () => {
    const shareData = {
      title: tourTitle,
      text: `Check out this amazing tour: ${tourTitle}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        // মোবাইলে নেটিভ শেয়ার মেনু ওপেন করবে
        await navigator.share(shareData);
      } else {
        // ডেক্সটপে লিংক কপি করে নিবে
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Tour link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Share Button */}
      <Button 
        onClick={handleShare}
        variant="outline" 
        className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/20 font-bold text-[10px] uppercase tracking-widest h-12 px-6 backdrop-blur-md transition-all active:scale-95"
      >
        <Share2 className="h-4 w-4 mr-2" /> Share Journey
      </Button>

      {/* Wishlist Button Container */}
      <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:border-emerald-500 transition-all cursor-pointer group active:scale-95">
        <WishlistButton listingId={tourId} />
      </div>
    </div>
  );
}