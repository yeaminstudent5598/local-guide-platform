import { UserService } from "@/modules/users/user.service";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import GuideCard from "./components/GuideCard";

export default async function GuidesPage() {
  const allUsers = await UserService.getAllUsers();
  const guides = allUsers?.filter((user: any) => user.role === "GUIDE") || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 🏔️ Premium Cinematic Header */}
      <div className="relative overflow-hidden bg-slate-950 pt-36 pb-12">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80" 
            alt="bg" fill className="object-cover opacity-30 grayscale" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <p className="text-emerald-400 font-bold text-[9px] uppercase tracking-[0.4em]">Verified Experts</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Our Local <span className="text-emerald-500 italic font-serif">Guides</span></h1>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-500" />
            <Input placeholder="Find an expert..." className="h-11 pl-11 rounded-xl bg-white/10 border-white/10 text-white text-xs focus-visible:ring-emerald-500" />
          </div>
        </div>
      </div>

      {/* 📦 Compact Grid (4 per row) */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {guides.map((guide: any) => (
            <GuideCard 
              key={guide.id} 
              guide={{
                ...guide,
                profileImage: guide.profileImage || "https://i.ibb.co/5GzXkwq/user-placeholder.png"
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}