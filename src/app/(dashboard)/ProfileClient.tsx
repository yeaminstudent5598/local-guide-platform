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
import { Loader2, Upload, User, Mail, Phone, BadgeCheck, Shield } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider"; // Language Hook

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  role: string;
  isVerified: boolean;
}

export default function ProfileClient({ initialData }: { initialData: UserProfile }) {
  const { lang } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(initialData);

  const { register, handleSubmit, setValue, watch } = useForm<UserProfile>({
    defaultValues: initialData
  });

  const profileImage = watch("profileImage");

  // Translations
  const t = {
    title: lang === 'en' ? "My Profile" : "আমার প্রোফাইল",
    subtitle: lang === 'en' ? "Manage your personal information" : "আপনার ব্যক্তিগত তথ্য পরিবর্তন করুন",
    upload: lang === 'en' ? "Change Photo" : "ছবি পরিবর্তন",
    verified: lang === 'en' ? "Verified Account" : "যাচাইকৃত অ্যাকাউন্ট",
    unverified: lang === 'en' ? "Unverified" : "যাচাই করা হয়নি",
    personalInfo: lang === 'en' ? "Personal Information" : "ব্যক্তিগত তথ্য",
    fullName: lang === 'en' ? "Full Name" : "পুরো নাম",
    email: lang === 'en' ? "Email Address" : "ইমেইল ঠিকানা",
    phone: lang === 'en' ? "Phone Number" : "ফোন নম্বর",
    bio: lang === 'en' ? "Bio" : "বায়ো",
    save: lang === 'en' ? "Save Changes" : "পরিবর্তন সেভ করুন",
    saving: lang === 'en' ? "Saving..." : "সেভ হচ্ছে...",
  };

  // Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setValue("profileImage", data.data.url);
        toast.success("Image uploaded", { id: toastId });
      }
    } catch (error) {
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  // Form Submit
  const onSubmit = async (data: UserProfile) => {
    const toastId = toast.loading(t.saving);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        setUserData({ ...userData, ...data });
        toast.success("Profile updated!", { id: toastId });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error("Update failed", { id: toastId });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t.title}</h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Profile Card */}
        <Card className="lg:col-span-1 h-fit shadow-sm border-slate-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/10 to-blue-100"></div>
          <CardContent className="-mt-16 flex flex-col items-center text-center space-y-4 relative">
            
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="h-32 w-32 border-[6px] border-white shadow-lg bg-white">
                <AvatarImage src={profileImage || "/placeholder-avatar.jpg"} className="object-cover" />
                <AvatarFallback className="text-4xl font-bold bg-slate-100 text-primary">
                  {userData.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-1 right-1 bg-white text-slate-700 p-2 rounded-full cursor-pointer shadow-md border border-slate-200 hover:bg-slate-50 transition-transform hover:scale-105"
                title={t.upload}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </label>
              <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
                {userData.name}
                {userData.isVerified && <BadgeCheck className="h-5 w-5 text-blue-500" />}
              </h3>
              <p className="text-sm text-slate-500 font-medium">{userData.email}</p>
            </div>

            {/* Badges */}
            <div className="w-full pt-4 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                 <span className="text-xs font-semibold text-slate-500 uppercase">Role</span>
                 <span className="text-sm font-bold text-slate-900">{userData.role}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                 <span className="text-xs font-semibold text-slate-500 uppercase">Status</span>
                 {userData.isVerified ? (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                       <Shield className="h-3 w-3" /> Verified
                    </span>
                 ) : (
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Unverified</span>
                 )}
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Right: Edit Form */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>{t.personalInfo}</CardTitle>
            <CardDescription>Update your photo and personal details here.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase font-bold text-slate-500">{t.fullName}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="name" className="pl-10 h-11 bg-slate-50/50 border-slate-200" {...register("name")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs uppercase font-bold text-slate-500">{t.phone}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="phone" className="pl-10 h-11 bg-slate-50/50 border-slate-200" placeholder="+880 1..." {...register("phone")} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase font-bold text-slate-500">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="email" className="pl-10 h-11 bg-slate-100 text-slate-500 cursor-not-allowed" {...register("email")} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs uppercase font-bold text-slate-500">{t.bio}</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us a little about yourself..." 
                  rows={5} 
                  className="resize-none bg-slate-50/50 border-slate-200"
                  {...register("bio")} 
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" size="lg" className="px-8 font-semibold shadow-lg shadow-primary/20">
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