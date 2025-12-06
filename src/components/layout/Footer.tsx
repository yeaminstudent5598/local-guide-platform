"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Mail, Phone, Map } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Use Hook

const Footer = () => {
  const { lang } = useLanguage(); // Language Context

  // Translations
  const t = {
    desc: lang === "en" 
      ? "Connect with local experts and discover the hidden gems of every city. Authentic experiences, curated for you." 
      : "স্থানীয় এক্সপার্টদের সাথে পরিচিত হোন এবং প্রতিটি শহরের অজানা সৌন্দর্য আবিষ্কার করুন।",
    explore: lang === "en" ? "Explore" : "ঘুরে দেখুন",
    browse: lang === "en" ? "Browse Tours" : "ট্যুর খুঁজুন",
    how: lang === "en" ? "How it Works" : "কিভাবে কাজ করে",
    guides: lang === "en" ? "Top Guides" : "সেরা গাইডবৃন্দ",
    contact: lang === "en" ? "Contact" : "যোগাযোগ",
    news: lang === "en" ? "Newsletter" : "নিউজলেটার",
    sub: lang === "en" ? "Subscribe" : "সাবস্ক্রাইব",
    policy: lang === "en" ? "Unsubscribe at any time. Privacy policy applies." : "যেকোনো সময় আনসাবস্ক্রাইব করতে পারেন।",
    rights: lang === "en" ? "All rights reserved." : "সর্বস্বত্ব সংরক্ষিত।",
  };

  return (
    <footer className="bg-white px-4 border-t pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Map className="h-5 w-5" /> Vistara
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              {t.desc}
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="text-slate-400 hover:text-primary transition-colors">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-900">{t.explore}</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/explore" className="hover:text-primary transition-colors">{t.browse}</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">{t.how}</Link></li>
              <li><Link href="/guides" className="hover:text-primary transition-colors">{t.guides}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-900">{t.contact}</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@vistara.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+880 1234 567 890</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-900">{t.news}</h4>
            <div className="flex gap-2">
              <Input placeholder="Email address" className="bg-slate-50" />
              <Button size="sm">{t.sub}</Button>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              {t.policy}
            </p>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Vistara Inc. {t.rights}</p>
          <div className="flex gap-6">
            <Link href="about" className="hover:text-slate-900">About US</Link>
            <Link href="#" className="hover:text-slate-900">Privacy</Link>
            <Link href="#" className="hover:text-slate-900">Terms</Link>
            <Link href="#" className="hover:text-slate-900">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;