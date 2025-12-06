"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Language Hook
import { motion } from "framer-motion";
import { Compass, UserPlus } from "lucide-react";

const CTASection = () => {
  const { lang } = useLanguage();

  // Translations
  const t = {
    heading: lang === "en" ? "Ready to Explore Like a Local?" : "স্থানীয়দের মতো ঘুরতে প্রস্তুত?",
    subHeading: lang === "en" 
      ? "Join thousands of travelers who are discovering the hidden gems of Bangladesh with Vistara." 
      : "হাজার হাজার ভ্রমণকারীদের সাথে যোগ দিন যারা ভিস্টারার মাধ্যমে বাংলাদেশের অজানা সৌন্দর্য আবিষ্কার করছেন।",
    exploreBtn: lang === "en" ? "Start Exploring" : "ঘুরতে শুরু করুন",
    guideBtn: lang === "en" ? "Become a Guide" : "গাইড হোন"
  };

  return (
    <section className="py-24 relative overflow-hidden bg-primary">
      
      {/* Abstract Background Shapes (Animated) */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
      />

      <div className="container relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            {t.heading}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.subHeading}
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/explore">
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 h-14 px-8 text-lg font-bold rounded-full shadow-xl shadow-black/10 group w-full sm:w-auto">
              <Compass className="mr-2 h-5 w-5 group-hover:rotate-45 transition-transform" /> 
              {t.exploreBtn}
            </Button>
          </Link>
          <Link href="/register?role=GUIDE">
            <Button size="lg" variant="outline" className="text-white border-2 border-white/30 hover:bg-white/10 hover:text-white hover:border-white h-14 px-8 text-lg font-bold rounded-full bg-transparent w-full sm:w-auto">
              <UserPlus className="mr-2 h-5 w-5" />
              {t.guideBtn}
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default CTASection;