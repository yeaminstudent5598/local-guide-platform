"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Globe, Heart, Award, TrendingUp, Shield } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "framer-motion";

export default function AboutClient() {
  const { lang } = useLanguage();

  // Translations
  const t = {
    badge: lang === "en" ? "Our Mission" : "আমাদের লক্ষ্য",
    heroTitle: lang === "en" ? "We Connect People" : "আমরা মানুষকে সংযুক্ত করি",
    heroHighlight: lang === "en" ? "Stories" : "গল্পের মাধ্যমে",
    heroSubtitle: lang === "en" 
      ? "Vistara is a platform that empowers locals to share their culture and travelers to experience the world authentically, beyond the guidebooks."
      : "ভিস্টারা একটি প্ল্যাটফর্ম যা স্থানীয়দের তাদের সংস্কৃতি শেয়ার করতে এবং ভ্রমণকারীদের প্রকৃত অভিজ্ঞতা নিতে সাহায্য করে।",
    
    imageCaption: lang === "en" ? "Global Community" : "বৈশ্বিক সম্প্রদায়",
    imageDesc: lang === "en" ? "Connecting cultures across 50+ cities." : "৫০+ শহরে সংস্কৃতির সংযোগ।",
    
    valuesTitle: lang === "en" ? "Our Core Values" : "আমাদের মূল মূল্যবোধ",
    
    value1Title: lang === "en" ? "Authenticity" : "সত্যতা",
    value1Desc: lang === "en" ? "No scripted tours, just real experiences." : "কোনো সাজানো ট্যুর নয়, শুধু প্রকৃত অভিজ্ঞতা।",
    
    value2Title: lang === "en" ? "Community" : "সম্প্রদায়",
    value2Desc: lang === "en" ? "Empowering locals to earn from their passion." : "স্থানীয়দের তাদের আবেগকে আয়ে পরিণত করতে সাহায্য করা।",
    
    value3Title: lang === "en" ? "Connection" : "সংযোগ",
    value3Desc: lang === "en" ? "Meaningful connections that last long." : "অর্থবহ সংযোগ যা দীর্ঘস্থায়ী হয়।",
    
    impactTitle: lang === "en" ? "Making an Impact" : "প্রভাব সৃষ্টি করছি",
    stat1: lang === "en" ? "Local Guides" : "স্থানীয় গাইড",
    stat2: lang === "en" ? "Happy Travelers" : "খুশি ভ্রমণকারী",
    stat3: lang === "en" ? "Cities Covered" : "শহর কভার করা হয়েছে",
    stat4: lang === "en" ? "Average Rating" : "গড় রেটিং",
    
    missionTitle: lang === "en" ? "Our Story" : "আমাদের গল্প",
    missionDesc: lang === "en" ? "We started in 2023 with a small group of passionate local guides." : "আমরা ২০২৩ সালে কিছু উৎসাহী স্থানীয় গাইড নিয়ে শুরু করেছিলাম।"
  };

  const values = [
    { Icon: Globe, title: t.value1Title, desc: t.value1Desc, color: "text-blue-600", bg: "bg-blue-50" },
    { Icon: Users, title: t.value2Title, desc: t.value2Desc, color: "text-purple-600", bg: "bg-purple-50" },
    { Icon: Heart, title: t.value3Title, desc: t.value3Desc, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* Hero */}
      <section className="py-24 container text-center max-w-4xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-primary font-bold tracking-wider text-sm uppercase mb-6 px-4 py-2 bg-primary/5 rounded-full"
        >
          {t.badge}
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]"
        >
          {t.heroTitle} <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
            {t.heroHighlight}
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
        >
          {t.heroSubtitle}
        </motion.p>
      </section>

      {/* Image Grid */}
      <section className="container mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[500px] rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="md:col-span-4 relative h-full bg-slate-200 group">
            <Image
              src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop"
              alt="Traveler"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="md:col-span-8 relative h-full bg-slate-200 group">
            <Image
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2070&auto=format&fit=crop"
              alt="Team"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{t.imageCaption}</h3>
              <p className="text-white/90 text-lg">{t.imageDesc}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">{t.valuesTitle}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 h-full group">
                  <CardContent className="pt-8">
                    <div className={`h-14 w-14 ${value.bg} rounded-2xl flex items-center justify-center ${value.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <value.Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 container">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">{t.impactTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "500+", label: t.stat1 },
                { value: "12k+", label: t.stat2 },
                { value: "50+", label: t.stat3 },
                { value: "4.8", label: t.stat4 }
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}