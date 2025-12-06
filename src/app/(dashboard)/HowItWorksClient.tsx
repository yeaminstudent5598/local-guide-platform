"use client";

import { Search, CalendarCheck, Map, ShieldCheck, UserCheck, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "framer-motion";

export default function HowItWorksClient() {
  const { lang } = useLanguage();

  const t = {
    title: lang === 'en' ? "Your Journey Starts Here" : "আপনার যাত্রা শুরু হোক এখান থেকেই",
    subtitle: lang === 'en' 
      ? "Vistara connects you with passionate local guides who turn typical trips into unforgettable stories."
      : "ভিস্টারা আপনাকে স্থানীয় গাইডদের সাথে সংযুক্ত করে যারা সাধারণ ভ্রমণকে অবিস্মরণীয় গল্পে পরিণত করে।",
    steps: [
      { 
        title: lang === 'en' ? "1. Find Your Experience" : "১. অভিজ্ঞতা খুঁজুন",
        desc: lang === 'en' ? "Browse curated tours. Filter by destination, price, and more." : "বাছাই করা ট্যুরগুলো দেখুন। গন্তব্য, মূল্য এবং অন্যান্য ফিল্টার ব্যবহার করুন।" 
      },
      { 
        title: lang === 'en' ? "2. Connect with Locals" : "২. স্থানীয়দের সাথে সংযোগ",
        desc: lang === 'en' ? "Check profiles and choose a guide who shares your interests." : "প্রোফাইল দেখুন এবং আপনার আগ্রহের সাথে মিলে এমন গাইড বেছে নিন।" 
      },
      { 
        title: lang === 'en' ? "3. Book Securely" : "৩. নিরাপদে বুক করুন",
        desc: lang === 'en' ? "Select dates and pay securely. Money is held until completion." : "তারিখ নির্বাচন করুন এবং নিরাপদে পেমেন্ট করুন। ট্যুর শেষ না হওয়া পর্যন্ত টাকা জমা থাকে।" 
      },
      { 
        title: lang === 'en' ? "4. Explore Like a Local" : "৪. স্থানীয়দের মতো ঘুরুন",
        desc: lang === 'en' ? "Meet your guide and discover hidden gems and local stories." : "গাইডের সাথে দেখা করুন এবং অজানা সৌন্দর্য ও গল্প আবিষ্কার করুন।" 
      }
    ],
    safetyTitle: lang === 'en' ? "Your Safety is Our Priority" : "আপনার নিরাপত্তা আমাদের অগ্রাধিকার",
    safetySub: lang === 'en' ? "Platform you can trust." : "একটি বিশ্বস্ত প্ল্যাটফর্ম।",
    verified: lang === 'en' ? "Verified Guides" : "যাচাইকৃত গাইড",
    verifiedDesc: lang === 'en' ? "Strict verification process including ID checks." : "আইডি চেক সহ কঠোর যাচাইকরণ প্রক্রিয়া।",
    secure: lang === 'en' ? "Secure Payments" : "নিরাপদ পেমেন্ট",
    secureDesc: lang === 'en' ? "Payment held until tour completion." : "ট্যুর শেষ না হওয়া পর্যন্ত পেমেন্ট হোল্ড করা হয়।",
    ready: lang === 'en' ? "Ready to explore?" : "ঘুরতে প্রস্তুত?",
    join: lang === 'en' ? "Join thousands of travelers." : "হাজার হাজার ভ্রমণকারীর সাথে যোগ দিন।",
    btn: lang === 'en' ? "Find a Tour" : "ট্যুর খুঁজুন"
  };

  const icons = [Search, UserCheck, CalendarCheck, Map];

  return (
    <div className="min-h-screen bg-white py-20">
      
      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-100 py-20 relative overflow-hidden">
        <div className="container text-center max-w-3xl relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6"
          >
            {t.title}
          </motion.h1>
          <p className="text-lg text-slate-600 leading-relaxed">{t.subtitle}</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-slate-100 -z-10 border-t border-dashed border-slate-300" />

          {t.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="h-24 w-24 bg-white border border-slate-200 rounded-full flex items-center justify-center text-primary mb-8 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300 relative z-10">
                  <Icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm px-2">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trust */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-3xl font-bold mb-4">{t.safetyTitle}</h2>
             <p className="text-slate-400">{t.safetySub}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-6 p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition">
               <div className="bg-green-500/20 p-4 rounded-xl h-fit"><ShieldCheck className="h-8 w-8 text-green-400" /></div>
               <div>
                  <h4 className="text-xl font-bold mb-2">{t.verified}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{t.verifiedDesc}</p>
               </div>
            </div>
            <div className="flex gap-6 p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition">
               <div className="bg-blue-500/20 p-4 rounded-xl h-fit"><HeartHandshake className="h-8 w-8 text-blue-400" /></div>
               <div>
                  <h4 className="text-xl font-bold mb-2">{t.secure}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{t.secureDesc}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-primary/5">
         <div className="container">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{t.ready}</h2>
           <p className="text-slate-600 mb-8 max-w-xl mx-auto">{t.join}</p>
           <Link href="/explore">
              <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/20">
                {t.btn} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
           </Link>
         </div>
      </section>

    </div>
  );
}