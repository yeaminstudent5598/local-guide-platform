"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, Users, Map, CalendarDays, TrendingUp, 
  CreditCard, Activity, PlusCircle, Compass, ArrowUpRight, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

// Interfaces
interface DashboardStats {
  totalEarnings?: number;
  totalListings?: number;
  totalBookings?: number;
  activeBookings?: number;
  totalTrips?: number;
  totalSpent?: number;
  pendingBookings?: number;
  monthlyStats?: { name: string; total: number }[];
}

interface DashboardClientProps {
  stats: DashboardStats;
  role: string;
  userName: string;
}

export default function DashboardClient({ stats, role, userName }: DashboardClientProps) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true); // ✅ Loading State

  // Simulation for Requirement 10
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const t = {
    welcome: lang === 'en' ? `Welcome back, ${userName} 👋` : `স্বাগতম, ${userName} 👋`,
    subtitle: lang === 'en' ? "Here is your activity overview for today." : "আপনার আজকের কার্যক্রমের ওভারভিউ এখানে।",
    earnings: lang === 'en' ? "Total Earnings" : "মোট আয়",
    listings: lang === 'en' ? "Active Listings" : "সক্রিয় লিস্টিং",
    bookings: lang === 'en' ? "Total Bookings" : "মোট বুকিং",
    pending: lang === 'en' ? "Pending Requests" : "অপেক্ষমান অনুরোধ",
    trips: lang === 'en' ? "Total Trips" : "মোট ভ্রমণ",
    spent: lang === 'en' ? "Total Spent" : "মোট খরচ",
    revenueChart: lang === 'en' ? "Revenue Overview" : "আয়ের ওভারভিউ",
    spendingChart: lang === 'en' ? "Spending Analytics" : "খরচের বিশ্লেষণ",
    quickActions: lang === 'en' ? "Quick Actions" : "দ্রুত পদক্ষেপ",
    createTour: lang === 'en' ? "Create New Listing" : "নতুন লিস্টিং তৈরি করুন",
    manageBookings: lang === 'en' ? "Manage Bookings" : "বুকিং ম্যানেজ করুন",
    explore: lang === 'en' ? "Explore Tours" : "ট্যুর খুঁজুন",
  };

  // ✅ Show Skeleton Loader while loading [Requirement 10]
  if (loading) return <DashboardSkeleton role={role} />;

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-500 bg-[#F8FAFB] min-h-screen">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">{t.welcome}</h2>
          <p className="text-slate-500 font-medium italic mt-1">{t.subtitle}</p>
        </div>
        <div className="flex gap-3">
           <Link href="/dashboard/profile">
              <Button variant="outline" className="rounded-2xl border-slate-200 h-12 px-6 font-bold hover:bg-slate-50 transition-all">
                {lang === 'en' ? "Edit Profile" : "প্রোফাইল এডিট"}
              </Button>
           </Link>
           {role === "GUIDE" ? (
              <Link href="/dashboard/listings/create">
                 <Button className="rounded-2xl h-12 px-6 shadow-xl shadow-emerald-900/10 bg-slate-900 hover:bg-emerald-600 text-white font-bold transition-all border-none">
                   <Sparkles className="w-4 h-4 mr-2" /> {t.createTour}
                 </Button>
              </Link>
           ) : (
              <Link href="/explore">
                 <Button className="rounded-2xl h-12 px-6 shadow-xl shadow-emerald-900/10 bg-slate-900 hover:bg-emerald-600 text-white font-bold transition-all border-none">
                   <Compass className="w-4 h-4 mr-2" /> {t.explore}
                 </Button>
              </Link>
           )}
        </div>
      </div>

      {/* --- GUIDE DASHBOARD --- */}
      {role === "GUIDE" && (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title={t.earnings} value={`৳ ${stats.totalEarnings?.toLocaleString()}`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" trend="+12.5%" />
            <StatsCard title={t.listings} value={stats.totalListings} icon={Map} color="text-blue-600" bg="bg-blue-50" />
            <StatsCard title={t.bookings} value={stats.totalBookings} icon={Users} color="text-purple-600" bg="bg-purple-50" />
            <StatsCard title={t.pending} value={stats.activeBookings} icon={CalendarDays} color="text-orange-600" bg="bg-orange-50" alert={stats.activeBookings! > 0} />
          </div>

          <div className="grid gap-8 grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-2">
                <CardTitle className="text-xl font-bold">{t.revenueChart}</CardTitle>
                <CardDescription className="italic font-medium">{lang === 'en' ? "Visualizing monthly earning performance" : "মাসিক আয়ের গ্রাফিক্যাল বিবরণ"}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pl-2">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyStats || []}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3 border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-4">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{t.quickActions}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <ActionLink href="/dashboard/listings/create" icon={PlusCircle} label={t.createTour} color="text-emerald-600" bg="bg-emerald-50" />
                <ActionLink href="/dashboard/bookings" icon={CalendarDays} label={t.manageBookings} color="text-orange-600" bg="bg-orange-50" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* --- TOURIST DASHBOARD --- */}
      {role === "TOURIST" && (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard title={t.trips} value={stats.totalTrips} icon={Map} color="text-blue-600" bg="bg-blue-50" />
            <StatsCard title={t.spent} value={`৳ ${stats.totalSpent?.toLocaleString()}`} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" />
            <StatsCard title={t.pending} value={stats.pendingBookings} icon={CreditCard} color="text-amber-600" bg="bg-amber-50" alert={stats.pendingBookings! > 0} />
          </div>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-4 overflow-hidden">
              <CardHeader className="p-8 pb-2">
                <CardTitle className="text-xl font-bold">{t.spendingChart}</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pl-2">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyStats || []}>
                      <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSpent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-slate-200 bg-white/50 hover:bg-emerald-50 transition-all cursor-pointer group rounded-[2.5rem]">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-white p-5 rounded-3xl shadow-xl mb-6 group-hover:scale-110 transition-transform">
                   <Compass className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {lang === 'en' ? "Plan Your Next Adventure" : "আপনার পরবর্তী ভ্রমণ পরিকল্পনা করুন"}
                </h3>
                <p className="text-slate-500 mb-8 max-w-sm font-medium italic">
                  {lang === 'en' ? "Discover the hidden gems of Bangladesh with local experts." : "লোকাল এক্সপার্টদের সাথে বাংলাদেশের লুকানো সৌন্দর্য আবিষ্কার করুন।"}
                </p>
                <Link href="/explore">
                  <Button size="lg" className="rounded-2xl px-10 h-14 bg-slate-900 hover:bg-emerald-600 text-white font-black shadow-xl shadow-slate-200 border-none transition-all">
                    {t.explore}
                  </Button>
                </Link>
              </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

function StatsCard({ title, value, icon: Icon, color, bg, trend, alert }: any) {
  return (
    <Card className={cn("border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-all", alert && "border-l-4 border-l-orange-500")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-600 transition-colors">{title}</CardTitle>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", bg)}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="text-3xl font-black text-slate-900 tracking-tighter">{value || 0}</div>
        {trend && (
           <p className={cn("text-[10px] mt-3 font-black flex items-center w-fit px-3 py-1 rounded-full shadow-sm bg-white", color)}>
              <ArrowUpRight className="h-3 w-3 mr-1" /> {trend}
           </p>
        )}
        {alert && <p className="text-[10px] text-orange-600 mt-3 font-black bg-orange-50 w-fit px-3 py-1 rounded-full uppercase tracking-tighter">Action Required</p>}
      </CardContent>
    </Card>
  );
}

function ActionLink({ href, icon: Icon, label, color, bg }: any) {
    return (
        <Link href={href}>
          <Button variant="outline" className="w-full h-16 justify-start gap-4 rounded-2xl border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200 transition-all font-bold group">
            <div className={cn("p-2.5 rounded-xl transition-colors", bg)}><Icon className={cn("h-5 w-5", color)} /></div> 
            <span className="text-slate-700 group-hover:text-slate-900">{label}</span>
          </Button>
        </Link>
    );
}

// --- 🦴 Requirement 10: Skeleton Component ---
function DashboardSkeleton({ role }: { role: string }) {
  const cards = role === "GUIDE" ? [1, 2, 3, 4] : [1, 2, 3];
  return (
    <div className="p-8 space-y-10 animate-pulse bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="space-y-3"><div className="h-10 w-64 bg-slate-200 rounded-xl" /><div className="h-4 w-48 bg-slate-200 rounded-lg" /></div>
        <div className="h-12 w-40 bg-slate-200 rounded-2xl" />
      </div>
      <div className={cn("grid gap-6", role === "GUIDE" ? "grid-cols-4" : "grid-cols-3")}>
        {cards.map(i => <div key={i} className="h-40 bg-white rounded-[2rem] shadow-sm" />)}
      </div>
      <div className="grid grid-cols-7 gap-8">
        <div className="col-span-4 h-[450px] bg-white rounded-[2.5rem]" />
        <div className="col-span-3 h-[450px] bg-white rounded-[2.5rem]" />
      </div>
    </div>
  );
}