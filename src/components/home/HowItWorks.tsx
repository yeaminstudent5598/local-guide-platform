"use client";

import { Search, CalendarCheck, Map, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const { lang } = useLanguage();

  // 1. Translations Data
  const content = {
    en: {
      heading: "Plan Your Trip in 3 Steps",
      subHeading: "Simple, fast, and secure booking process.",
      steps: [
        { title: "Search", desc: "Find the perfect tour from our curated list of local experiences." },
        { title: "Book", desc: "Select your preferred date and book securely in just a few clicks." },
        { title: "Enjoy", desc: "Meet your local guide and create unforgettable memories." }
      ]
    },
    bn: {
      heading: "৩টি সহজ ধাপে ভ্রমণ পরিকল্পনা করুন",
      subHeading: "সহজ, দ্রুত এবং নিরাপদ বুকিং প্রক্রিয়া।",
      steps: [
        { title: "খুঁজুন", desc: "আমাদের লোকাল এক্সপেরিয়েন্সের তালিকা থেকে আপনার পছন্দের ট্যুরটি খুঁজুন।" },
        { title: "বুক করুন", desc: "আপনার পছন্দের তারিখ নির্বাচন করুন এবং নিরাপদে বুকিং নিশ্চিত করুন।" },
        { title: "উপভোগ করুন", desc: "আপনার লোকাল গাইডের সাথে দেখা করুন এবং স্মৃতিময় ভ্রমণ উপভোগ করুন।" }
      ]
    }
  };

  const t = content[lang];

  // Icons Array (Static)
  const icons = [Search, CalendarCheck, Map];

  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            {t.heading}
          </h2>
          <p className="text-lg text-slate-500">
            {t.subHeading}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-200 via-primary/20 to-slate-200 -z-10 border-t-2 border-dashed border-slate-300" />

          {t.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Circle */}
                <div className="relative mb-6">
                  <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg shadow-slate-200 border border-slate-100 group-hover:scale-110 transition-transform duration-300 z-10 relative">
                    <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                       <Icon className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  
                  {/* Step Badge */}
                  <div className="absolute -top-2 -right-2 h-8 w-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white shadow-sm z-20">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}