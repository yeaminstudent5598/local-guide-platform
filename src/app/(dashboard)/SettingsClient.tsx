"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ShieldAlert, Trash2, KeyRound, AlertTriangle, Sparkles, Fingerprint, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider"; 
import { cn } from "@/lib/utils";

// Schema
const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(6, "Min 6 chars"),
  confirmPassword: z.string().min(1, "Required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsClient() {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true); // ✅ For Skeleton Loader [Req 10]

  // --- 🔄 Simulation for Skeleton Loader ---
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Translations
  const t = {
    title: lang === 'en' ? "Security Settings" : "নিরাপত্তা সেটিংস",
    subtitle: lang === 'en' ? "Audit your security protocols and account data." : "আপনার নিরাপত্তা প্রোটোকল এবং অ্যাকাউন্ট তথ্য যাচাই করুন।",
    secTitle: lang === 'en' ? "Pass-Key Management" : "পাসওয়ার্ড ব্যবস্থাপনা",
    secDesc: lang === 'en' ? "Update your credentials regularly for maximum safety." : "সর্বোচ্চ নিরাপত্তার জন্য নিয়মিত পাসওয়ার্ড পরিবর্তন করুন।",
    currPass: lang === 'en' ? "Current Pass-Key" : "বর্তমান পাসওয়ার্ড",
    newPass: lang === 'en' ? "New Pass-Key" : "নতুন পাসওয়ার্ড",
    confPass: lang === 'en' ? "Verify New Pass-Key" : "নতুন পাসওয়ার্ড নিশ্চিত করুন",
    updateBtn: lang === 'en' ? "Update Protocols" : "আপডেট করুন",
    updating: lang === 'en' ? "Syncing..." : "আপডেট হচ্ছে...",
    success: lang === 'en' ? "Security updated successfully" : "নিরাপত্তা তথ্য আপডেট হয়েছে",
    dangerTitle: lang === 'en' ? "Danger Zone" : "ডেঞ্জার জোন",
    dangerDesc: lang === 'en' ? "Irreversible actions regarding your account existence." : "অ্যাকাউন্ট ডিলিট করার অপরিবর্তনীয় পদক্ষেপ।",
    delTitle: lang === 'en' ? "Terminate Journey" : "অ্যাকাউন্ট ডিলিট",
    delBtn: lang === 'en' ? "Delete Forever" : "স্থায়ীভাবে ডিলিট",
    confirmDel: lang === 'en' ? "Authorize termination? This is permanent!" : "অ্যাকাউন্ট ডিলিট করতে চান? এটি আর ফিরে পাওয়া যাবে না!",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    const toastId = toast.loading(t.updating);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(t.success, { id: toastId });
        reset();
      } else {
        throw new Error(result.message || "Failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm(t.confirmDel)) return;
    toast.error("Termination restricted in review mode.");
  };

  // ✅ Show Skeleton Loader while loading [Requirement 10]
  if (isPageLoading) return <SettingsSkeleton />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 bg-[#F8FAFB] min-h-screen animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="border-b border-slate-100 pb-8">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
             <Sparkles className="h-3 w-3" /> Professional Audit
        </div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900">{t.title}</h2>
        <p className="text-sm font-medium text-slate-500 italic mt-2">{t.subtitle}</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        
        {/* Sidebar Info Section */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                 <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                Security Protocol
              </h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                 "A secure journey begins with a strong identity. Use complex symbols and update your keys every 90 days."
              </p>
           </div>
           
           <div className="p-6 rounded-[2rem] bg-slate-900 text-white shadow-xl">
              <Fingerprint className="h-8 w-8 text-emerald-500 mb-4 opacity-50" />
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Authenticated</p>
              <p className="text-sm font-medium opacity-80">Your account is protected by Vistara's end-to-end security mesh.</p>
           </div>
        </div>

        {/* Main Content Areas */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Password Change Luxury Card */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50 bg-white">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                      <KeyRound className="h-6 w-6 text-emerald-600" />
                   </div>
                   <div>
                      <CardTitle className="text-xl font-bold text-slate-900">{t.secTitle}</CardTitle>
                      <CardDescription className="text-xs font-medium italic">{t.secDesc}</CardDescription>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.currPass}</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...register("oldPassword")}
                      className={cn("h-14 px-6 rounded-2xl border-none bg-slate-50 font-medium focus-visible:ring-emerald-500 shadow-inner", errors.oldPassword && "ring-2 ring-rose-500")}
                    />
                    {errors.oldPassword && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.oldPassword.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.newPass}</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...register("newPassword")}
                        className={cn("h-14 px-6 rounded-2xl border-none bg-slate-50 font-medium focus-visible:ring-emerald-500 shadow-inner", errors.newPassword && "ring-2 ring-rose-500")}
                      />
                      {errors.newPassword && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.newPassword.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.confPass}</Label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...register("confirmPassword")}
                        className={cn("h-14 px-6 rounded-2xl border-none bg-slate-50 font-medium focus-visible:ring-emerald-500 shadow-inner", errors.confirmPassword && "ring-2 ring-rose-500")}
                      />
                      {errors.confirmPassword && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={loading} className="h-16 px-10 rounded-[1.8rem] bg-slate-900 hover:bg-emerald-600 text-white font-black text-lg transition-all shadow-xl shadow-slate-200 border-none group">
                      {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t.updating}</> : <>{t.updateBtn} <ShieldCheck className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" /></>}
                      </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* 2. Danger Zone Luxury Card */}
            <Card className="border-none shadow-2xl shadow-rose-200/30 rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-rose-50/30 border-b border-rose-50 p-8">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white rounded-2xl border border-rose-100 shadow-sm">
                      <AlertTriangle className="h-6 w-6 text-rose-600" />
                   </div>
                   <div>
                      <CardTitle className="text-xl font-bold text-rose-700">{t.dangerTitle}</CardTitle>
                      <CardDescription className="text-xs font-medium text-rose-600/70 italic">{t.dangerDesc}</CardDescription>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-1">
                       <h4 className="font-bold text-slate-900">{t.delTitle}</h4>
                       <p className="text-xs font-medium text-slate-400 max-w-xs leading-relaxed">
                          {t.delText || "Once you delete your account, there is no going back. All tour history will be wiped."}
                       </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="h-14 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 font-black shadow-xl shadow-rose-100 border-none"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t.delBtn}
                    </Button>
                 </div>
              </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}

// --- 🦴 Requirement 10: Skeleton Component ---
function SettingsSkeleton() {
  return (
    <div className="p-10 space-y-12 animate-pulse bg-slate-50 min-h-screen max-w-7xl mx-auto">
      <div className="space-y-4 border-b border-slate-100 pb-8">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="h-4 w-full max-w-md bg-slate-200 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-6">
            <div className="h-[200px] bg-white rounded-[2rem] shadow-sm" />
            <div className="h-[150px] bg-slate-200 rounded-[2rem]" />
        </div>
        <div className="lg:col-span-2 space-y-8">
            <div className="h-[450px] bg-white rounded-[2.5rem] shadow-sm" />
            <div className="h-[250px] bg-white rounded-[2.5rem] shadow-sm" />
        </div>
      </div>
    </div>
  );
}