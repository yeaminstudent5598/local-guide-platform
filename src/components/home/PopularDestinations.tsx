"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Language Hook

// Destinations Data with Translations
const destinations = [
  { 
    id: 1, 
    name: { en: "Sylhet", bn: "সিলেট" }, 
    count: 15, 
    image: "/images/demo1.jpg", 
    size: "col-span-1 md:col-span-2 md:row-span-2 h-[400px]" 
  },
  { 
    id: 2, 
    name: { en: "Cox's Bazar", bn: "কক্সবাজার" }, 
    count: 24, 
    image: "/images/coxbazar.jpg", 
    size: "col-span-1 h-[190px]" 
  },
  { 
    id: 3, 
    name: { en: "Bandarban", bn: "বান্দরবান" }, 
    count: 10, 
    image: "/images/sreemongol.jpg", 
    size: "col-span-1 h-[190px]" 
  },
  { 
    id: 4, 
    name: { en: "Sajek Valley", bn: "সাজেক ভ্যালি" }, 
    count: 8, 
    image: "/images/sajek.jpg", 
    size: "col-span-1 md:col-span-2 h-[190px]" 
  },
];

const PopularDestinations = () => {
  const { lang } = useLanguage(); // ✅ Get current language

  // Translations for Static Text
  const t = {
    heading: lang === "en" ? "Popular Destinations" : "জনপ্রিয় গন্তব্য",
    subHeading: lang === "en" ? "Explore the most visited places by our community." : "আমাদের কমিউনিটির সবচেয়ে জনপ্রিয় জায়গাগুলো ঘুরে দেখুন।",
    tours: lang === "en" ? "Tours" : "টি ট্যুর",
  };

  return (
    <section className="py-20 bg-white">
      <div className="container">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">{t.heading}</h2>
          <p className="text-slate-500 mt-2">{t.subHeading}</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {destinations.map((dest) => (
            <Link 
              key={dest.id} 
              // Search query-te English name-i pathacchi jate API kaj kore
              href={`/explore?city=${dest.name.en}`} 
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${dest.size}`}
            >
              <Image
                src={dest.image}
                alt={dest.name.en}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              {/* Text Content */}
              <div className="absolute bottom-5 left-5 text-white transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                {/* Dynamic Name based on Lang */}
                <h3 className="text-2xl font-bold">{dest.name[lang]}</h3>
                
                <p className="text-sm text-slate-300 font-medium flex items-center gap-1">
                   {dest.count}+ {t.tours}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularDestinations;