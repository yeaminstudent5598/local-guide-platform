"use client";

import { useState } from "react";
import LoginForm from "@/components/forms/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck, MapPin, Sparkles, Fingerprint, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [loadingRole, setLoadingRole] = useState("");

  const handleInstantLogin = async (email: string, pass: string, role: string) => {
    setLoadingRole(role);
    const apiUrl = "/api/v1/auth/login"; 

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        localStorage.setItem("accessToken", result.data.accessToken);
        document.cookie = `accessToken=${result.data.accessToken}; path=/; max-age=86400;`;
        
        toast.success(lang === "en" ? `Access Granted: ${role}` : `${role} হিসেবে প্রবেশ সফল!`);
        
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login API Error:", error);
      toast.error("Network error! Please check your server.");
    } finally {
      setLoadingRole("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFB] p-4 relative font-sans overflow-hidden">
      <div className="absolute -top-24 -left-24 h-[500px] w-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative z-10">
        <Card className="border-slate-100 shadow-2xl rounded-[3rem] overflow-hidden bg-white/90 backdrop-blur-xl">
          <CardHeader className="text-center pt-10 pb-4 space-y-2">
            <div className="mx-auto h-16 w-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-2 shadow-xl border border-white/10">
              <Fingerprint className="h-8 w-8 text-emerald-500" />
            </div>
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">
              {lang === "en" ? "Vistara Access" : "ভিস্তারা এক্সেস"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium italic">
              {lang === "en" ? "Select a role for instant dashboard entry" : "সরাসরি ড্যাশবোর্ডে প্রবেশের জন্য রোল বেছে নিন"}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-12 space-y-8">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" /> One-Click Authentication
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <DemoButton 
                    icon={User} label={lang === "en" ? "Tourist" : "ট্যুরিস্ট"} 
                    isLoading={loadingRole === "Tourist"}
                    onClick={() => handleInstantLogin("fukula@mailinator.com", "Pa$$w0rd!", "Tourist")} 
                  />
                  <DemoButton 
                    icon={MapPin} label={lang === "en" ? "Guide" : "গাইড"} 
                    isLoading={loadingRole === "Guide"}
                    onClick={() => handleInstantLogin("guide@gmail.com", "Yeamin5598@$", "Guide")} 
                  />
                  <DemoButton 
                    icon={ShieldCheck} label={lang === "en" ? "Admin" : "এডমিন"} 
                    isLoading={loadingRole === "Admin"}
                    onClick={() => handleInstantLogin("admin@vistara.com", "password123", "Admin")} 
                  />
               </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                <span className="bg-white px-4 italic underline decoration-emerald-500/30 underline-offset-4 decoration-2">Or manual credentials</span>
              </div>
            </div>

            <LoginForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

const DemoButton = ({ icon: Icon, label, onClick, isLoading }: any) => (
  <Button 
    variant="outline" 
    onClick={onClick}
    disabled={isLoading}
    className="h-24 flex-col gap-2 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all font-bold active:scale-95"
  >
    {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-600" /> : <Icon className="h-6 w-6 text-slate-400 group-hover:text-emerald-600" />}
    <span className="text-[10px] uppercase tracking-widest font-black leading-none">{label}</span>
  </Button>
);