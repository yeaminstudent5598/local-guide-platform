"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface GuideCardProps {
  guide: {
    id: string;
    name: string;
    profileImage: string;
    expertise: string[];
    languages: string[];
    rating: number;
    totalReviews: number;
    location: string;
    isVerified: boolean;
  };
}

const GuideCard = ({ guide }: GuideCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Profile Image Section */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={guide.profileImage || "/placeholder-avatar.jpg"}
          alt={guide.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Verified Badge */}
        {guide.isVerified && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white flex gap-1 items-center px-2 py-1 border-none">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {guide.name}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {guide.location}
            </div>
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-amber-700 text-sm">{guide.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-2 my-4">
          {guide.expertise.slice(0, 3).map((exp, index) => (
            <span 
              key={index} 
              className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-primary/5 text-primary rounded-md border border-primary/10"
            >
              {exp}
            </span>
          ))}
          {guide.expertise.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{guide.expertise.length - 3} more</span>
          )}
        </div>

        <div className="border-t border-border/50 pt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{guide.totalReviews}</span> Reviews
          </div>
          
          <Link href={`/guides/${guide.id}`}>
            <Button size="sm" variant="outline" className="rounded-full hover:bg-primary hover:text-white transition-all">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default GuideCard;