"use client";

import { useState } from "react";
import GuideCard from "@/components/guides/GuideCard";
import { Search, X, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // ✅ এটি মিসিং ছিল, এখন যোগ করা হয়েছে
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function GuidesClient({ initialGuides }: { initialGuides: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuides = initialGuides.filter((guide) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesName = guide.name?.toLowerCase().includes(searchLower);
    const matchesExpertise = guide.expertise?.some((e: string) => 
      e.toLowerCase().includes(searchLower)
    );
    return matchesName || matchesExpertise;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* --- 🏔️ Luxury Header --- */}
      <div className="relative overflow-hidden bg-slate-950 pt-36 pb-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80" 
            alt="header-bg" fill className="object-cover opacity-30 grayscale" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-4 text-left">
              <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.4em]">Verified Units</p>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
                Our Expert <span className="text-emerald-500 italic font-serif">Storytellers</span>
              </h1>
            </div>

            <div className="relative w-full lg:w-[450px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
              <Input 
                placeholder="Search by name or expertise..." 
                className="h-16 pl-12 pr-12 rounded-2xl bg-white/10 backdrop-blur-2xl border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500 text-lg shadow-2xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- 📦 Results Grid --- */}
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <AnimatePresence mode="popLayout">
          {filteredGuides.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredGuides.map((guide: any) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center bg-white border border-slate-100 rounded-[3rem]">
              <Navigation className="h-12 w-12 text-slate-200 animate-bounce mb-4" />
              <h3 className="text-xl font-bold text-slate-900">No Experts Found</h3>
              <Button variant="link" className="mt-2 text-emerald-600 font-bold uppercase text-[10px]" onClick={() => setSearchTerm("")}>
                Reset Search
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}