"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "framer-motion";
import { Compass, UserPlus, Sparkles, MapPin, Heart, Star } from "lucide-react";

const CTASection = () => {
  const { lang } = useLanguage();

  // Translations
  const t = {
    heading: lang === "en" ? "Ready to Explore Like a Local?" : "স্থানীয়দের মতো ঘুরতে প্রস্তুত?",
    subHeading: lang === "en" 
      ? "Join thousands of travelers discovering Bangladesh's hidden gems with local experts." 
      : "হাজার হাজার ভ্রমণকারীদের সাথে যোগ দিন যারা স্থানীয় এক্সপার্টদের সাথে বাংলাদেশ আবিষ্কার করছেন।",
    exploreBtn: lang === "en" ? "Start Exploring" : "ঘুরতে শুরু করুন",
    guideBtn: lang === "en" ? "Become a Guide" : "গাইড হোন",
    stat1: lang === "en" ? "Happy Travelers" : "খুশি ভ্রমণকারী",
    stat2: lang === "en" ? "Local Guides" : "স্থানীয় গাইড",
    stat3: lang === "en" ? "Destinations" : "গন্তব্য",
  };

  // Floating icons animation
  const floatingIcons = [
    { Icon: MapPin, delay: 0, x: -100, y: -50 },
    { Icon: Heart, delay: 0.5, x: 100, y: -80 },
    { Icon: Star, delay: 1, x: -80, y: 80 },
    { Icon: Compass, delay: 1.5, x: 120, y: 60 },
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Glowing Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -40, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl"
      />

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
            x: [0, x * 0.3, 0],
            y: [0, y * 0.3, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            delay,
            ease: "easeInOut" 
          }}
          className="absolute hidden md:block"
          style={{ 
            left: `${20 + index * 20}%`, 
            top: `${30 + (index % 2) * 40}%` 
          }}
        >
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      ))}

      <div className="container relative z-10">
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              {lang === "en" ? "Most Trusted Travel Platform" : "সবচেয়ে বিশ্বস্ত ট্রাভেল প্ল্যাটফর্ম"}
            </span>
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            {t.heading}
          </h2>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.subHeading}
          </p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/explore">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 h-16 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-black/20 group w-full sm:w-auto relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Compass className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" /> 
                {t.exploreBtn}
              </Button>
            </Link>
            <Link href="/register?role=GUIDE">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-2 border-white/40 hover:bg-white hover:text-primary h-16 px-10 text-lg font-bold rounded-2xl backdrop-blur-sm bg-white/5 w-full sm:w-auto group transition-all duration-300"
              >
                <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t.guideBtn}
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { number: "10K+", label: t.stat1 },
              { number: "500+", label: t.stat2 },
              { number: "100+", label: t.stat3 },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-black text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-white/70 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default CTASection;