"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Upload, User, Mail, Phone, BadgeCheck, Shield, Globe, Briefcase, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  role: string;
  isVerified: boolean;
  languages: any;
  expertise: any;
}

export default function ProfileClient({ initialData }: { initialData: UserProfile }) {
  const { lang } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Loading State
  const [userData, setUserData] = useState(initialData);

  // --- 🔄 Simulation for Skeleton Loader [Requirement 10] ---
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const { register, handleSubmit, setValue, watch } = useForm<UserProfile>({
    defaultValues: initialData
  });

  const profileImage = watch("profileImage");

  const t = {
    title: lang === 'en' ? "My Profile" : "আমার প্রোফাইল",
    subtitle: lang === 'en' ? "Manage your identity and credentials" : "আপনার পরিচয় এবং তথ্য পরিবর্তন করুন",
    upload: lang === 'en' ? "Change Photo" : "ছবি পরিবর্তন",
    personalInfo: lang === 'en' ? "Identity Details" : "ব্যক্তিগত তথ্য",
    fullName: lang === 'en' ? "Full Name" : "পুরো নাম",
    email: lang === 'en' ? "Email Address" : "ইমেইল ঠিকানা",
    phone: lang === 'en' ? "Contact Number" : "ফোন নম্বর",
    bio: lang === 'en' ? "Professional Bio" : "বায়ো",
    languages: lang === 'en' ? "Languages (Comma separated)" : "ভাষা (কমা দিয়ে আলাদা করুন)",
    expertise: lang === 'en' ? "Expertise (Comma separated)" : "দক্ষতা (কমা দিয়ে আলাদা করুন)",
    save: lang === 'en' ? "Save Profile" : "সেভ করুন",
    saving: lang === 'en' ? "Syncing..." : "সেভ হচ্ছে...",
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const toastId = toast.loading("Processing image...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/v1/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setValue("profileImage", data.data.url);
        toast.success("Identity visual updated", { id: toastId });
      }
    } catch (error) {
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: UserProfile) => {
    const toastId = toast.loading(t.saving);
    const formattedData = {
      ...data,
      languages: typeof data.languages === 'string' 
        ? data.languages.split(',').map(s => s.trim()).filter(Boolean) 
        : data.languages,
      expertise: typeof data.expertise === 'string' 
        ? data.expertise.split(',').map(s => s.trim()).filter(Boolean) 
        : data.expertise,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json();
      if (result.success) {
        setUserData({ ...userData, ...data });
        toast.success("Profile synced successfully", { id: toastId });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error("Sync failed", { id: toastId });
    }
  };

  // ✅ Show Skeleton Loader while loading [Requirement 10]
  if (loading) return <ProfileSkeleton />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 md:p-10 bg-[#F8FAFB] min-h-screen">
      <div>
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
             <Sparkles className="h-3 w-3" /> Account Settings
        </div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900">{t.title}</h2>
        <p className="text-sm font-medium text-slate-500 italic mt-1">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <Card className="lg:col-span-1 h-fit border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <div className="h-32 bg-slate-900 relative overflow-hidden">
             <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-3xl" />
          </div>
          <CardContent className="-mt-16 flex flex-col items-center text-center space-y-4 pb-10">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-8 border-white shadow-xl bg-white">
                <AvatarImage src={profileImage || "https://i.ibb.co/5GzXkwq/user-placeholder.png"} className="object-cover" />
                <AvatarFallback className="text-3xl font-black bg-slate-50 text-emerald-600">{userData.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 bg-slate-950 p-2.5 rounded-full cursor-pointer shadow-xl hover:bg-emerald-600 transition-all border-2 border-white">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Upload className="h-4 w-4 text-white" />}
              </label>
              <input id="avatar-upload" type="file" className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
                {userData.name} {userData.isVerified && <BadgeCheck className="h-5 w-5 text-emerald-500" />}
              </h3>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-slate-100 px-3 py-1">
                 {userData.role}
              </Badge>
            </div>
            
            <div className="w-full pt-6 space-y-3 border-t border-slate-50">
                <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Security Clearance</span>
                    {userData.isVerified ? (
                        <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100">Level: Verified</span>
                    ) : (
                        <span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-amber-100">Level: Restricted</span>
                    )}
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-xl font-bold">{t.personalInfo}</CardTitle>
            <CardDescription className="text-xs font-medium italic">Update your public profile and professional skillsets.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.fullName}</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <Input className="h-14 pl-12 rounded-2xl border-none bg-slate-50 font-medium focus-visible:ring-emerald-500" {...register("name")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.phone}</Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <Input className="h-14 pl-12 rounded-2xl border-none bg-slate-50 font-medium focus-visible:ring-emerald-500" {...register("phone")} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.email}</Label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <Input className="h-14 pl-12 rounded-2xl border-none bg-slate-100 text-slate-400 font-medium cursor-not-allowed italic" {...register("email")} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.languages}</Label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <Input placeholder="English, Bengali" className="h-14 pl-12 rounded-2xl border-none bg-slate-50 font-medium" {...register("languages")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.expertise}</Label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <Input placeholder="Hiking, Adventure" className="h-14 pl-12 rounded-2xl border-none bg-slate-50 font-medium" {...register("expertise")} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.bio}</Label>
                <Textarea rows={4} className="rounded-2xl border-none bg-slate-50 font-medium resize-none focus-visible:ring-emerald-500 p-4" {...register("bio")} />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-slate-950 hover:bg-emerald-600 text-white px-10 rounded-[1.8rem] h-16 font-black text-lg transition-all shadow-xl shadow-slate-200 border-none group">
                  {t.save} <BadgeCheck className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- 🦴 Requirement 10: Skeleton Component ---
function ProfileSkeleton() {
  return (
    <div className="p-10 space-y-10 animate-pulse bg-slate-50 min-h-screen max-w-7xl mx-auto">
      <div className="space-y-3"><div className="h-10 w-64 bg-slate-200 rounded-xl" /><div className="h-4 w-40 bg-slate-200 rounded-lg" /></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="h-[450px] bg-white rounded-[2.5rem]" />
        <Card className="lg:col-span-2 h-[600px] bg-white rounded-[2.5rem]" />
      </div>
    </div>
  );
}