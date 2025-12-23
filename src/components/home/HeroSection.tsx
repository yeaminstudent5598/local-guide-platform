"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  Search, MapPin, Calendar, Users, 
  Compass, Globe, Sparkles, Navigation 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

const HeroSection = () => {
  const router = useRouter();
  const { lang } = useLanguage();
  
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState("1");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append("city", destination);
    router.push(`/explore?${params.toString()}`);
  };

  const t = {
    headline: lang === "en" ? "Crafting Memories with" : "স্মৃতিময় ভ্রমণের সঙ্গী",
    highlight: lang === "en" ? "Local Experts" : "লোকাল এক্সপার্টরা",
    subHeadline: lang === "en" 
      ? "Experience Bangladesh like never before. Curated journeys led by passionate storytellers." 
      : "নতুনভাবে আবিষ্কার করুন বাংলাদেশকে। অভিজ্ঞ লোকাল গাইডের সাথে শুরু হোক আপনার যাত্রা।",
    destination: lang === "en" ? "Where to?" : "কোথায় যাবেন?",
    date: lang === "en" ? "When?" : "কবে?",
    travelers: lang === "en" ? "Travelers" : "ভ্রমণকারী",
    search: lang === "en" ? "Find My Guide" : "গাইড খুঁজুন",
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      
      {/* --- 🖼️ Cinematic Background with Smart Overlays --- */}
      <div className="absolute inset-0 z-0 scale-110">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2070&auto=format&fit=crop")',
          }}
        />
        {/* টেক্সট স্পষ্ট করার জন্য বাম পাশে ডার্ক মাস্ক */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-black/30 z-[1]" /> 
      </div>

      <div className="container relative z-10 px-6 pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- 📝 Text Content (Ultra-Readability) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-[0.4em] drop-shadow-md"
              >
                <div className="h-0.5 w-10 bg-emerald-500 rounded-full" />
                Vistara Expedition Terminal
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                {t.headline} <br /> 
                <span className="text-emerald-500 relative inline-block">
                  {t.highlight}
                  <Sparkles className="absolute -top-6 -right-10 h-8 w-8 text-emerald-400 opacity-60 animate-pulse" />
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-100 max-w-lg leading-relaxed font-medium opacity-100 drop-shadow-lg">
                {t.subHeadline}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <BadgeItem icon={Compass} text="500+ Verified Guides" />
              <BadgeItem icon={Navigation} text="Exclusive Routes" />
            </div>
          </motion.div>

          {/* --- 🔍 High-Contrast Search Widget --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-xl"
          >
            <div className="relative bg-slate-900/80 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
              <div className="space-y-8">
                
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                    <MapPin className="h-3.5 w-3.5" /> {t.destination}
                  </label>
                  <Input 
                    placeholder="e.g. Sylhet, Bandarban..." 
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 h-14 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 text-lg transition-all"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                      <Calendar className="h-3.5 w-3.5" /> {t.date}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-14 justify-start bg-white/5 border-white/20 rounded-2xl text-slate-100 hover:bg-white/10 hover:text-white"
                        >
                          {date ? format(date, "MMM dd, yyyy") : "Select Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-slate-800 bg-slate-900 text-white shadow-2xl">
                        <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                      <Users className="h-3.5 w-3.5" /> {t.travelers}
                    </label>
                    <Input 
                      type="number" 
                      min={1} 
                      className="bg-white/5 border-white/20 text-white h-14 rounded-2xl focus:ring-2 focus:ring-emerald-500/50"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSearch}
                  className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xl rounded-2xl shadow-xl shadow-emerald-500/30 transition-all active:scale-[0.98] border-none"
                >
                  <Search className="mr-3 h-6 w-6 stroke-[3px]" />
                  {t.search}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50/10 to-transparent z-10" />
    </section>
  );
};

const BadgeItem = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-lg">
    <Icon className="h-4 w-4 text-emerald-400" />
    <span className="text-xs font-bold text-white tracking-wide uppercase">{text}</span>
  </div>
);

export default HeroSection;