"use client";

import { motion } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Hook added

export default function FAQ() {
  const { lang } = useLanguage(); // ✅ Get current language

  // --- 🌍 Translations ---
  const t = {
    badge: lang === "en" ? "Questions" : "প্রশ্নাবলী",
    title: lang === "en" ? "Common" : "সাধারণ",
    subtitle: lang === "en" ? "Inquiries" : "জিজ্ঞাসা",
    faqs: lang === "en" ? [
      { 
        q: "How do I book a local guide?", 
        a: "You can simply search for your destination, pick a guide that fits your vibe, and click 'Book Expedition'. It's that simple!" 
      },
      { 
        q: "Are the guides verified?", 
        a: "Yes, every guide on Vistara undergoes a rigorous verification process including background checks to ensure your safety." 
      },
      { 
        q: "Can I cancel my booking?", 
        a: "Most of our tours offer a partial or full refund depending on how early you cancel. Please check the individual tour's policy." 
      },
      { 
        q: "Is payment secure on Vistara?", 
        a: "Absolutely. We use industry-standard encryption to protect your data and funds until the tour is successfully completed." 
      }
    ] : [
      { 
        q: "স্থানীয় গাইড কিভাবে বুক করব?", 
        a: "আপনার গন্তব্য খুঁজুন, আপনার পছন্দের গাইড বেছে নিন এবং 'বুক এক্সপিডিশন' বাটনে ক্লিক করুন। এটি অত্যন্ত সহজ!" 
      },
      { 
        q: "গাইডরা কি ভেরিফাইড বা যাচাইকৃত?", 
        a: "হ্যাঁ, আপনার নিরাপত্তা নিশ্চিত করতে ভিস্তারার প্রতিটি গাইডকে কঠোর যাচাইকরণ এবং ব্যাকগ্রাউন্ড চেকিং প্রক্রিয়ার মধ্য দিয়ে যেতে হয়।" 
      },
      { 
        q: "আমি কি আমার বুকিং বাতিল করতে পারি?", 
        a: "আমাদের বেশিরভাগ ট্যুরেই বাতিলের সময় অনুযায়ী আংশিক বা পূর্ণ রিফান্ডের সুবিধা রয়েছে। প্রতিটি ট্যুরের নিজস্ব নিয়মাবলী চেক করুন।" 
      },
      { 
        q: "ভিস্তারায় পেমেন্ট কি নিরাপদ?", 
        a: "অবশ্যই। আপনার ডাটা এবং টাকা সুরক্ষিত রাখতে আমরা ইন্ডাস্ট্রি-স্ট্যান্ডার্ড এনক্রিপশন ব্যবহার করি এবং ট্যুর শেষ না হওয়া পর্যন্ত টাকা সংরক্ষিত থাকে।" 
      }
    ]
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 border px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
               <HelpCircle className="h-3 w-3 mr-2" /> {t.badge}
            </Badge>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none">
            {t.title} <span className="text-emerald-600 italic font-serif">{t.subtitle}</span>
          </h2>
          <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full mt-4" />
        </div>

        {/* FAQ Grid */}
        <div className="grid gap-6">
          {t.faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-[2.5rem] border border-slate-100 hover:border-emerald-200 transition-all duration-500 bg-slate-50/40 hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/5 cursor-help"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-emerald-500" />
                     {faq.q}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {faq.a}
                  </p>
                </div>
                
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-50 group-hover:rotate-180 transition-transform duration-500">
                   <ChevronDown className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Suggestion */}
        <div className="mt-16 text-center">
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
             Still have questions? <span className="text-emerald-600 underline cursor-pointer hover:text-emerald-700">Contact our concierge</span>
           </p>
        </div>
      </div>
    </section>
  );
}

// --- 🏷️ Custom Styled Badge Component ---
const Badge = ({ children, className }: any) => (
  <span className={`inline-flex items-center ${className}`}>
    {children}
  </span>
);