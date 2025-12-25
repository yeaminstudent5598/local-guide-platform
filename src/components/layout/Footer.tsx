"use client";

import Link from "next/link";
import { 
  Facebook, Instagram, Twitter, Linkedin, 
  MapPin, Mail, Phone, Map, 
  Globe, ShieldCheck, ArrowUpRight, Sparkles
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const Footer = () => {
  const { lang } = useLanguage();

  const t = {
    desc: lang === "en" 
      ? "Discover the authentic soul of Bangladesh with our verified local storytellers. Curated journeys for the modern traveler." 
      : "আমাদের ভেরিফাইড গাইডদের সাথে আবিষ্কার করুন বাংলাদেশের আসল সৌন্দর্য। আধুনিক ভ্রমণপিপাসুদের জন্য বিশেষ আয়োজন।",
    explore: lang === "en" ? "Expeditions" : "ট্যুরসমূহ",
    support: lang === "en" ? "Company" : "কোম্পানি",
    contact: lang === "en" ? "Get in Touch" : "যোগাযোগ",
    rights: lang === "en" ? "All rights reserved." : "সর্বস্বত্ব সংরক্ষিত।",
  };

  const socialLinks = [
    { Icon: Facebook, href: "https://facebook.com" },
    { Icon: Instagram, href: "https://instagram.com" },
    { Icon: Twitter, href: "https://twitter.com" },
    { Icon: Linkedin, href: "https://linkedin.com" },
  ];

  const quickLinks = [
    { name: lang === "en" ? "Browse Tours" : "ট্যুর খুঁজুন", href: "/explore" },
    { name: lang === "en" ? "Expert Guides" : "সেরা গাইডবৃন্দ", href: "/guides" },
    { name: lang === "en" ? "How it Works" : "কিভাবে কাজ করে", href: "/how-it-works" },
    { name: lang === "en" ? "Destinations" : "গন্তব্যসমূহ", href: "/explore" },
  ];

  const legalLinks = [
    { name: lang === "en" ? "About Us" : "আমাদের সম্পর্কে", href: "/about" },
    { name: lang === "en" ? "Privacy Policy" : "গোপনীয়তা নীতি", href: "/privacy" },
    { name: lang === "en" ? "Terms of Service" : "শর্তাবলী", href: "/terms" },
    { name: lang === "en" ? "Contact Support" : "সাপোর্ট সেন্টার", href: "/contact" },
  ];

  return (
    <footer className="bg-white text-slate-600 pt-24 pb-12 border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-slate-900 group w-fit">
              <div className="bg-emerald-600 p-1.5 rounded-xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <Map className="h-6 w-6 text-white" />
              </div>
              Vistara
            </Link>
            <p className="text-sm leading-relaxed max-w-sm font-medium text-slate-500">
              {t.desc}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href }, i) => (
                <Link 
                  key={i} 
                  href={href} 
                  className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-[0.2em]">{t.explore}</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-semibold hover:text-emerald-600 transition-colors flex items-center group">
                    {link.name} <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-[0.2em]">{t.support}</h4>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-semibold hover:text-emerald-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-[0.2em]">{t.contact}</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 shadow-sm">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-sm">
                  <p className="text-slate-900 font-bold tracking-tight">Main Hub</p>
                  <p className="mt-0.5 font-medium text-slate-500 italic">Gulshan, Dhaka, Bangladesh</p>
                </div>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                  <Mail className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-slate-700">yeaminstudent5598@gmail.com</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Phone className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-slate-700">+880 1641 801 705</p>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Bottom Utility Bar --- */}
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Vistara Expedition. {t.rights}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 shadow-sm">
                <ShieldCheck className="h-3 w-3" /> Secure Payment
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                <Globe className="h-3 w-3" /> 24/7 Support
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
             Made with <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" /> for Travelers
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;