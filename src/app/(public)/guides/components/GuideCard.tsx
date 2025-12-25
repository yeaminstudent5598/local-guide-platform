"use client";

import Image from "next/image";
import { Star, BadgeCheck, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface GuideProps {
  guide: {
    id: string;
    name: string;
    expertise: string[];
    profileImage?: string | null;
    isVerified: boolean;
    rating?: number; // সার্ভিস থেকে আসা ডাইনামিক রেটিং
    _count?: {
      reviewsReceived: number;
    }
  };
}

export default function GuideCard({ guide }: GuideProps) {
  // রেটিং ১ দশমিক ঘর পর্যন্ত ফিক্স করা (যেমন: ৪.৫)
  const displayRating = (guide.rating ?? 0).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group bg-white border border-slate-100 rounded-xl p-3 hover:shadow-md hover:border-emerald-200 transition-all"
    >
      <div className="flex items-center gap-3">
        {/* ১. ইমেজ */}
        <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-50">
          <Image
            src={guide.profileImage || "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80"}
            alt={guide.name || "Guide"}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* ২. কন্টেন্ট */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <h3 className="text-[13px] font-bold text-slate-900 truncate">
              {guide.name}
            </h3>
            {guide.isVerified && <BadgeCheck className="h-3 w-3 text-blue-500 shrink-0" />}
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-2 font-medium">
            <MapPin className="h-2.5 w-2.5" />
            <span>Local Expert</span>
          </div>

          {/* ডাইনামিক রেটিং এবং রিভিউর সংখ্যা */}
          <div className="flex items-center gap-1">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-slate-600">{displayRating}</span>
            <span className="text-[9px] text-slate-300">({guide._count?.reviewsReceived ?? 0})</span>
          </div>
        </div>

        {/* ৩. বাটন */}
        <Link href={`/guides/${guide.id}`} className="shrink-0">
          <button className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100">
            Profile
          </button>
        </Link>
      </div>

      {/* ৪. এক্সপার্টাইজ */}
      <div className="mt-3 flex flex-wrap gap-1 border-t border-slate-50 pt-2">
        {guide.expertise?.slice(0, 1).map((skill, index) => (
          <span key={index} className="text-[9px] font-bold uppercase text-slate-400">
            {skill}
          </span>
        ))}
        {guide.expertise?.length > 1 && (
          <span className="text-[9px] text-slate-300 font-medium">
            +{guide.expertise.length - 1} more
          </span>
        )}
      </div>
    </motion.div>
  );
}