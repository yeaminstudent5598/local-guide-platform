"use client";

import { 
  Search, 
  TicketCheck, 
  MapPin, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Globe
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HowItWorks() {
  const { lang, t: translate } = useLanguage() as any;

  // 1. Professional Content Data
  const content = {
    en: {
      badge: "Process",
      heading: "Your Journey in 3 Simple Steps",
      subHeading: "We've streamlined everything so you can focus on the adventure.",
      steps: [
        { 
          title: "Discover Local Gems", 
          desc: "Browse through hundreds of curated tours and hidden spots led by verified experts.",
          color: "emerald" 
        },
        { 
          title: "Secure Your Spot", 
          desc: "Instant booking with protected payments and flexible cancellation policies.",
          color: "indigo" 
        },
        { 
          title: "Experience Bangladesh", 
          desc: "Meet your guide, skip the queues, and dive into authentic local culture.",
          color: "rose" 
        }
      ]
    },
    bn: {
      badge: "কার্যপদ্ধতি",
      heading: "৩টি সহজ ধাপে আপনার যাত্রা শুরু করুন",
      subHeading: "আমরা সবকিছু সহজ করে দিয়েছি যাতে আপনি কেবল ভ্রমণের আনন্দ উপভোগ করতে পারেন।",
      steps: [
        { 
          title: "সেরা জায়গা খুঁজুন", 
          desc: "ভেরিফাইড বিশেষজ্ঞদের দ্বারা পরিচালিত শত শত ট্যুর এবং লুকানো সৌন্দর্য খুঁজে নিন।",
          color: "emerald" 
        },
        { 
          title: "বুকিং নিশ্চিত করুন", 
          desc: "সুরক্ষিত পেমেন্ট এবং সহজ ক্যান্সেলেশন পলিসির মাধ্যমে দ্রুত বুকিং সম্পন্ন করুন।",
          color: "indigo" 
        },
        { 
          title: "স্মৃতি তৈরি করুন", 
          desc: "আপনার গাইডের সাথে দেখা করুন এবং বাংলাদেশের আসল সংস্কৃতিকে কাছ থেকে দেখুন।",
          color: "rose" 
        }
      ]
    }
  };

  const t = content[lang === 'bn' ? 'bn' : 'en'];
  const icons = [Search, TicketCheck, Globe];

  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
      
      {/* --- Abstract Background Elements --- */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] opacity-60" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- Section Header --- */}
        <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Sparkles className="h-3 w-3 fill-emerald-600" /> {t.badge}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]"
          >
            {t.heading}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium italic opacity-80"
          >
            {t.subHeading}
          </motion.p>
        </div>

        {/* --- Steps Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {t.steps.map((step, index) => {
            const Icon = icons[index];
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative"
              >
                {/* Connector Arrow (Desktop) */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 -translate-y-1/2 z-20">
                    <ChevronRight className="h-8 w-8 text-slate-200 animate-pulse" />
                  </div>
                )}

                {/* Card Design */}
                <div className="h-full p-8 md:p-10 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-200/40 transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden">
                  
                  {/* Step Counter Background */}
                  <span className="absolute -top-4 -right-4 text-[120px] font-black text-slate-50 opacity-[0.03] select-none group-hover:opacity-[0.05] transition-opacity">
                    0{index + 1}
                  </span>

                  <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                    {/* Icon Container */}
                    <div className={cn(
                      "h-16 w-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:rotate-6 duration-500",
                      index === 0 ? "bg-emerald-500 text-white shadow-emerald-200" :
                      index === 1 ? "bg-indigo-500 text-white shadow-indigo-200" :
                      "bg-rose-500 text-white shadow-rose-200"
                    )}>
                      <Icon className="h-8 w-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                      {step.title}
                    </h3>
                    
                    <p className="text-slate-500 leading-relaxed font-medium">
                      {step.desc}
                    </p>

                    {/* Quality Badges */}
                    <div className="mt-8 pt-6 border-t border-slate-50 w-full flex items-center gap-4 justify-center lg:justify-start">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                           <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                           <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Best Price
                        </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* --- Trust Footer (Optional) --- */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-20 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <div className="flex items-center gap-2 font-black text-slate-900"><ShieldCheck className="h-5 w-5" /> VERIFIED GUIDES</div>
          <div className="flex items-center gap-2 font-black text-slate-900"><MapPin className="h-5 w-5" /> 50+ CITIES</div>
          <div className="flex items-center gap-2 font-black text-slate-900"><Globe className="h-5 w-5" /> LOCALLY OWNED</div>
        </motion.div>

      </div>
    </section>
  );
}