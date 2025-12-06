"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Upload, User, Mail, Phone, BadgeCheck } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  role: string;
  isVerified: boolean;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const { register, handleSubmit, setValue, watch } = useForm<UserProfile>();
  const profileImage = watch("profileImage");

  // 1. Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("/api/v1/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.data);
          setValue("name", data.data.name);
          setValue("email", data.data.email);
          setValue("phone", data.data.phone || "");
          setValue("bio", data.data.bio || "");
          setValue("profileImage", data.data.profileImage || "");
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  // 2. Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setValue("profileImage", data.data.url);
        toast.success("Image uploaded");
      }
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 3. Handle Form Submit
  const onSubmit = async (data: UserProfile) => {
    const toastId = toast.loading("Updating profile...");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          bio: data.bio,
          profileImage: data.profileImage,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Profile updated successfully!", { id: toastId });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error("Update failed", { id: toastId });
    }
  };

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Profile Card */}
        <Card className="md:col-span-1 shadow-sm">
          <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
            
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                {/* ✅ FIX: Removed objectFit, used className instead */}
                <AvatarImage 
                  src={profileImage || "/placeholder-avatar.jpg"} 
                  className="object-cover" 
                  alt="Profile" 
                />
                <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploading} 
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
              
              <div className="mt-3 flex gap-2 justify-center items-center">
                <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                  {user?.role}
                </span>
                {user?.isVerified && (
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Edit Form */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="name" className="pl-10" {...register("name")} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="email" className="pl-10 bg-slate-50" {...register("email")} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="phone" className="pl-10" placeholder="+880 1..." {...register("phone")} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us a little about yourself..." 
                  rows={4} 
                  className="resize-none"
                  {...register("bio")} 
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" className="px-8">Save Changes</Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}