"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Hook added

export default function Newsletter() {
  const { lang } = useLanguage(); // ✅ Get current language
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // --- 🌍 Translations ---
  const t = {
    badge: lang === "en" ? "Premium Updates" : "প্রিমিয়াম আপডেট",
    title: lang === "en" ? "Join the" : "যোগ দিন",
    subtitle: lang === "en" ? "Expedition" : "অভিযান",
    club: lang === "en" ? "Club" : "ক্লাবে",
    desc: lang === "en" 
      ? "Subscribe to get curated travel deals, hidden gems, and local storytelling directly in your inbox." 
      : "সেরা ট্রাভেল ডিল, লুকানো সৌন্দর্য এবং স্থানীয় গল্প সরাসরি আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।",
    placeholder: lang === "en" ? "your@email.com" : "আপনার ইমেইল দিন",
    btnDefault: lang === "en" ? "Subscribe" : "সাবস্ক্রাইব",
    btnLoading: lang === "en" ? "Processing..." : "প্রসেসিং...",
    successTitle: lang === "en" ? "You're subscribed!" : "সাবস্ক্রাইব সফল হয়েছে!",
    successSub: lang === "en" ? "Welcome to the inner circle." : "আমাদের ক্লাবে আপনাকে স্বাগতম।"
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); 
      setIsSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-emerald-600">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-950 rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl"
        >
          {/* Decorative Background Glow */}
          <div className="absolute -top-24 -right-24 h-64 w-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em]">
                <Sparkles className="h-3.5 w-3.5" /> {t.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                {t.title} <span className="text-emerald-500 italic font-serif pr-2">{t.subtitle}</span> {t.club}
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                {t.desc}
              </p>
            </div>

            {/* Right Side: Form or Success */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem]">
              <AnimatePresence mode="wait">
                {!isSubscribed ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                      <Input 
                        type="email"
                        placeholder={t.placeholder} 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-16 pl-12 bg-transparent border-none text-white focus-visible:ring-0 text-base"
                      />
                    </div>
                    <Button 
                      disabled={isLoading}
                      className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-all"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin" /> {t.btnLoading}
                        </div>
                      ) : t.btnDefault}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-6 space-y-3 text-center"
                  >
                    <div className="h-14 w-14 bg-emerald-500/20 rounded-full flex items-center justify-center">
                       <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-white font-bold text-xl">{t.successTitle}</h4>
                       <p className="text-slate-500 text-sm">{t.successSub}</p>
                    </div>
                    <button 
                       onClick={() => setIsSubscribed(false)}
                       className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:underline pt-2"
                    >
                       {lang === "en" ? "Subscribe another email" : "অন্য ইমেইল দিয়ে চেষ্টা করুন"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}