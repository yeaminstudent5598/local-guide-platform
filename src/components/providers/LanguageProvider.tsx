"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/constants/translations";

type Language = "en" | "bn";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>("en");

  // Load saved language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("app-lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "bn")) {
      setLangState(savedLang);
    }
  }, []);

  // Update body class and data attribute when language changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      const body = document.body;
      
      // Add/remove Bengali class
      if (lang === "bn") {
        body.classList.add("bengali-active");
        body.setAttribute("data-lang", "bn");
      } else {
        body.classList.remove("bengali-active");
        body.setAttribute("data-lang", "en");
      }
    }
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("app-lang", newLang);
    }
  };

  const value = {
    lang,
    setLang,
    t: translations[lang]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};