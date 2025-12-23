"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Upload, User, Mail, Phone, BadgeCheck, Shield, Globe, Briefcase } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  role: string;
  isVerified: boolean;
  languages: any; // স্ট্রিং হিসেবে ইনপুট নিয়ে এরে হিসেবে পাঠানো হবে
  expertise: any;
}

export default function ProfileClient({ initialData }: { initialData: UserProfile }) {
  const { lang } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(initialData);

  const { register, handleSubmit, setValue, watch } = useForm<UserProfile>({
    defaultValues: initialData
  });

  const profileImage = watch("profileImage");

  const t = {
    title: lang === 'en' ? "My Profile" : "আমার প্রোফাইল",
    subtitle: lang === 'en' ? "Manage your personal information" : "আপনার ব্যক্তিগত তথ্য পরিবর্তন করুন",
    upload: lang === 'en' ? "Change Photo" : "ছবি পরিবর্তন",
    personalInfo: lang === 'en' ? "Personal Information" : "ব্যব্যক্তিগত তথ্য",
    fullName: lang === 'en' ? "Full Name" : "পুরো নাম",
    email: lang === 'en' ? "Email Address" : "ইমেইল ঠিকানা",
    phone: lang === 'en' ? "Phone Number" : "ফোন নম্বর",
    bio: lang === 'en' ? "Bio" : "বায়ো",
    languages: lang === 'en' ? "Languages (Comma separated)" : "ভাষা (কমা দিয়ে আলাদা করুন)",
    expertise: lang === 'en' ? "Expertise (Comma separated)" : "দক্ষতা (কমা দিয়ে আলাদা করুন)",
    save: lang === 'en' ? "Save Changes" : "পরিবর্তন সেভ করুন",
    saving: lang === 'en' ? "Saving..." : "সেভ হচ্ছে...",
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const toastId = toast.loading("Uploading...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/v1/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setValue("profileImage", data.data.url);
        toast.success("Image updated", { id: toastId });
      }
    } catch (error) {
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: UserProfile) => {
    const toastId = toast.loading(t.saving);
    
    // টেক্সট ইনপুটকে এরে (Array) তে রূপান্তর
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
        toast.success("Profile updated successfully", { id: toastId });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update profile", { id: toastId });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 bg-white">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t.title}</h2>
        <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Stats Card */}
        <Card className="lg:col-span-1 h-fit shadow-sm border-slate-100 rounded-2xl overflow-hidden">
          <div className="h-24 bg-emerald-50"></div>
          <CardContent className="-mt-12 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-white shadow-md bg-white">
                <AvatarImage src={profileImage || "https://i.ibb.co/5GzXkwq/user-placeholder.png"} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-slate-50 text-emerald-600">{userData.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <label htmlFor="avatar-upload" className="absolute bottom-1 right-1 bg-white p-2 rounded-full cursor-pointer shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 text-slate-600" />}
              </label>
              <input id="avatar-upload" type="file" className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1.5">
                {userData.name} {userData.isVerified && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
              </h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{userData.role}</p>
            </div>
            
            <div className="w-full pt-4 space-y-2 border-t border-slate-50">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-tighter">Account Status</span>
                    {userData.isVerified ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Verified</span>
                    ) : (
                        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">Pending</span>
                    )}
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2 shadow-sm border-slate-100 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">{t.personalInfo}</CardTitle>
            <CardDescription className="text-xs">Update your credentials and skills below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-400 uppercase">{t.fullName}</Label>
                  <Input className="h-11 border-slate-100 bg-slate-50/30 focus-visible:ring-emerald-500" {...register("name")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-400 uppercase">{t.phone}</Label>
                  <Input className="h-11 border-slate-100 bg-slate-50/30 focus-visible:ring-emerald-500" {...register("phone")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-400 uppercase">{t.email}</Label>
                <Input className="h-11 border-slate-100 bg-slate-100 text-slate-500 cursor-not-allowed" {...register("email")} disabled />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-400 uppercase">{t.languages}</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                    <Input placeholder="English, Bengali" className="pl-10 h-11 border-slate-100 bg-slate-50/30" {...register("languages")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-400 uppercase">{t.expertise}</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-slate-300" />
                    <Input placeholder="Hiking, Adventure" className="pl-10 h-11 border-slate-100 bg-slate-50/30" {...register("expertise")} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-400 uppercase">{t.bio}</Label>
                <Textarea rows={4} className="border-slate-100 bg-slate-50/30 resize-none focus-visible:ring-emerald-500" {...register("bio")} />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-slate-900 hover:bg-emerald-600 text-white px-8 rounded-xl h-11 font-bold transition-all shadow-lg shadow-slate-100">
                  {t.save}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}