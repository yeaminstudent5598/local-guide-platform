"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  listingId: string;
}

export default function WishlistButton({ listingId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent parent Link click
    e.stopPropagation();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login to save tours");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId }),
      });

      const data = await res.json();
      
      if (data.success) {
        setIsWishlisted(data.data.added);
        toast.success(data.message);
        router.refresh(); // Refresh page data if needed
      } else {
        throw new Error(data.message || "Failed to update wishlist");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm transition-all"
      onClick={handleToggle}
      disabled={loading}
      title="Add to Wishlist"
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isWishlisted ? "fill-red-500 text-red-500" : "text-slate-600"
        }`}
      />
    </Button>
  );
}