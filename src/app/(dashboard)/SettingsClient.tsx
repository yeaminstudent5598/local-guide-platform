"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, ShieldAlert, Trash2, KeyRound, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Language Hook

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Translations
  const t = {
    title: lang === 'en' ? "Account Settings" : "অ্যাকাউন্ট সেটিংস",
    desc: lang === 'en' ? "Manage your security preferences and account data." : "আপনার নিরাপত্তা এবং অ্যাকাউন্ট তথ্য পরিচালনা করুন।",
    
    // Security Section
    secTitle: lang === 'en' ? "Security & Password" : "নিরাপত্তা ও পাসওয়ার্ড",
    secDesc: lang === 'en' ? "Update your password to keep your account safe." : "অ্যাকাউন্ট নিরাপদ রাখতে পাসওয়ার্ড আপডেট করুন।",
    currPass: lang === 'en' ? "Current Password" : "বর্তমান পাসওয়ার্ড",
    newPass: lang === 'en' ? "New Password" : "নতুন পাসওয়ার্ড",
    confPass: lang === 'en' ? "Confirm Password" : "পাসওয়ার্ড নিশ্চিত করুন",
    updateBtn: lang === 'en' ? "Update Password" : "পাসওয়ার্ড আপডেট করুন",
    updating: lang === 'en' ? "Updating..." : "আপডেট হচ্ছে...",
    success: lang === 'en' ? "Password updated successfully" : "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে",
    
    // Danger Zone
    dangerTitle: lang === 'en' ? "Danger Zone" : "ডেঞ্জার জোন",
    dangerDesc: lang === 'en' ? "Irreversible actions regarding your account." : "আপনার অ্যাকাউন্টের অপরিবর্তনীয় পদক্ষেপসমূহ।",
    delTitle: lang === 'en' ? "Delete Account" : "অ্যাকাউন্ট ডিলিট করুন",
    delText: lang === 'en' ? "Once you delete your account, there is no going back. Please be certain." : "একবার ডিলিট করলে আর ফিরে পাওয়া যাবে না। দয়া করে নিশ্চিত হোন।",
    delBtn: lang === 'en' ? "Delete Account" : "ডিলিট করুন",
    confirmDel: lang === 'en' ? "Are you sure? This cannot be undone!" : "আপনি কি নিশ্চিত? এটি ফিরে পাওয়া যাবে না!",
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
    toast.error("Action restricted in demo mode.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-2 md:p-4">
      
      {/* Page Header */}
      <div className="border-b pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t.title}</h2>
        <p className="text-muted-foreground mt-1">{t.desc}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Sidebar / Info (Desktop only) */}
        <div className="hidden lg:block lg:col-span-1 space-y-4">
           <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <ShieldAlert className="h-4 w-4" /> Security Tips
              </h4>
              <p className="text-xs opacity-90 leading-relaxed">
                 Use a strong password with mixed characters. Do not share your password with anyone.
              </p>
           </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Password Change Card */}
            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b px-6 py-4">
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-white rounded-md border shadow-sm">
                      <KeyRound className="h-5 w-5 text-primary" />
                   </div>
                   <div>
                      <CardTitle className="text-lg">{t.secTitle}</CardTitle>
                      <CardDescription>{t.secDesc}</CardDescription>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-5">
                  
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">{t.currPass}</Label>
                    <Input 
                      id="oldPassword" 
                      type="password" 
                      placeholder="••••••" 
                      {...register("oldPassword")}
                      className={errors.oldPassword ? "border-red-500" : ""}
                    />
                    {errors.oldPassword && <p className="text-xs text-red-500">{errors.oldPassword.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t.newPass}</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        placeholder="••••••" 
                        {...register("newPassword")}
                        className={errors.newPassword ? "border-red-500" : ""}
                      />
                      {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t.confPass}</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="••••••" 
                        {...register("confirmPassword")}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                      <Button type="submit" disabled={loading} className="w-full md:w-auto font-semibold shadow-md shadow-primary/20">
                      {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.updating}</> : t.updateBtn}
                      </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* 2. Danger Zone Card */}
            <Card className="border-red-100 bg-white shadow-sm overflow-hidden">
              <CardHeader className="bg-red-50/30 border-b border-red-100 px-6 py-4">
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-white rounded-md border border-red-100 shadow-sm">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                   </div>
                   <div>
                      <CardTitle className="text-lg text-red-700">{t.dangerTitle}</CardTitle>
                      <CardDescription className="text-red-600/70">{t.dangerDesc}</CardDescription>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                       <h4 className="font-medium text-slate-900">{t.delTitle}</h4>
                       <p className="text-sm text-muted-foreground max-w-xs">
                          {t.delText}
                       </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 shadow-md shadow-red-200 whitespace-nowrap"
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