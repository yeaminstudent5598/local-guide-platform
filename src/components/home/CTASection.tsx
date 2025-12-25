"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "framer-motion";
import { 
  Compass, UserPlus, Sparkles, 
  ArrowRight, Globe, ShieldCheck, 
  Map as MapIcon 
} from "lucide-react";

const CTASection = () => {
  const { lang } = useLanguage();

  const t = {
    badge: lang === "en" ? "Join the Elite Expedition" : "অভিজাত ভ্রমণে যোগ দিন",
    heading: lang === "en" ? "Unlock the Soul of" : "আবিষ্কার করুন",
    highlight: lang === "en" ? "Bangladesh" : "বাংলাদেশকে",
    subHeading: lang === "en" 
      ? "Connect with passionate local storytellers and experience authentic journeys curated just for you." 
      : "পেশাদার লোকাল গাইডের সাথে যুক্ত হোন এবং আপনার জন্য তৈরি বিশেষ ভ্রমণের অভিজ্ঞতা নিন।",
    exploreBtn: lang === "en" ? "Start Journey" : "যাত্রা শুরু করুন",
    guideBtn: lang === "en" ? "Register as Guide" : "গাইড হিসেবে যোগ দিন",
    stat1: lang === "en" ? "Travelers" : "ভ্রমণকারী",
    stat2: lang === "en" ? "Experts" : "এক্সপার্ট গাইড",
    stat3: lang === "en" ? "Spots" : "স্পটসমূহ",
  };

  return (
    <section className="py-32 px-4 relative overflow-hidden bg-slate-950">
      
      {/* --- 🌌 Cinematic Background Mask (Z-0) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-fixed opacity-20 grayscale"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=2070")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="container relative z-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 text-emerald-500 font-bold text-[10px] uppercase tracking-[0.4em]">
                <div className="h-0.5 w-10 bg-emerald-500 rounded-full" />
                {t.badge}
              </div>
              
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1]">
                {t.heading} <br />
                <span className="text-emerald-500 italic font-serif pr-4">{t.highlight}</span>
              </h2>

              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl font-medium">
                {t.subHeading}
              </p>
            </motion.div>

            {/* Buttons (Fixed Clickable Area) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-5 relative z-30"
            >
              <Link href="/explore" className="cursor-pointer">
                <Button size="lg" className="h-16 px-10 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-2xl shadow-emerald-900/40 transition-all border-none group active:scale-95">
                  {t.exploreBtn} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/register?role=GUIDE" className="cursor-pointer">
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-[1.5rem] border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-emerald-400 font-bold text-lg backdrop-blur-md transition-all active:scale-95">
                  <UserPlus className="mr-2 h-5 w-5" /> {t.guideBtn}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Stats Bento Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative z-20">
            <StatCard number="25k+" label={t.stat1} icon={Globe} delay={0.1} />
            <StatCard number="850+" label={t.stat2} icon={ShieldCheck} delay={0.2} />
            <StatCard number="120+" label={t.stat3} icon={MapIcon} delay={0.3} isLarge />
            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center group cursor-default hover:bg-emerald-600/20 transition-all">
               <Sparkles className="h-8 w-8 text-emerald-500 mb-3 animate-pulse" />
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-tight">Premium <br/> Expedition</p>
            </div>
          </div>

        </div>

        {/* --- 🛠️ Fixed Blur Accent (Added pointer-events-none) --- */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 h-96 w-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0" 
        />
      </div>
    </section>
  );
};

const StatCard = ({ number, label, icon: Icon, delay, isLarge = false }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className={cn(
      "bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] transition-all hover:bg-white/10 hover:border-emerald-500/30",
      isLarge && "col-span-1"
    )}
  >
    <Icon className="h-5 w-5 text-emerald-500 mb-4" />
    <h4 className="text-3xl font-bold text-white tracking-tighter">{number}</h4>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</p>
  </motion.div>
);

function cn(...inputs: any) {
  return inputs.filter(Boolean).join(" ");
}

export default CTASection;