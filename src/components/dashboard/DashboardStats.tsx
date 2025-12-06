"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, Users, Map, CalendarDays, TrendingUp, 
  CreditCard, Activity, PlusCircle, Compass, ArrowUpRight, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Defs, LinearGradient, Stop 
} from "recharts";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Language Hook

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
  const { lang } = useLanguage(); // Language Context

  // Translations object
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
    recent: lang === 'en' ? "Recent Activity" : "সাম্প্রতিক কার্যকলাপ",
  };

  return (
    <div className="space-y-8 p-2 md:p-4 animate-in fade-in duration-500">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t.welcome}</h2>
          <p className="text-muted-foreground mt-1">{t.subtitle}</p>
        </div>
        <div className="flex gap-3">
           <Link href="/dashboard/profile">
              <Button variant="outline" className="rounded-full border-slate-300">
                {lang === 'en' ? "Edit Profile" : "প্রোফাইল এডিট"}
              </Button>
           </Link>
           {role === "GUIDE" ? (
              <Link href="/dashboard/listings/create">
                 <Button className="rounded-full shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/90">
                   <Sparkles className="w-4 h-4 mr-2" /> {t.createTour}
                 </Button>
              </Link>
           ) : (
              <Link href="/explore">
                 <Button className="rounded-full shadow-lg shadow-primary/20">
                   <Compass className="w-4 h-4 mr-2" /> {t.explore}
                 </Button>
              </Link>
           )}
        </div>
      </div>

      {/* ==========================
          GUIDE DASHBOARD VIEW
         ========================== */}
      {role === "GUIDE" && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title={t.earnings} 
              value={`৳ ${stats.totalEarnings?.toLocaleString()}`} 
              icon={DollarSign} 
              color="text-green-600" 
              bg="bg-green-50"
              trend="+12%"
            />
            <StatsCard 
              title={t.listings} 
              value={stats.totalListings} 
              icon={Map} 
              color="text-blue-600" 
              bg="bg-blue-50"
            />
            <StatsCard 
              title={t.bookings} 
              value={stats.totalBookings} 
              icon={Users} 
              color="text-purple-600" 
              bg="bg-purple-50"
            />
            <StatsCard 
              title={t.pending} 
              value={stats.activeBookings} 
              icon={CalendarDays} 
              color="text-orange-600" 
              bg="bg-orange-50"
              alert={stats.activeBookings! > 0}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
            
            {/* --- Earnings Chart --- */}
            <Card className="lg:col-span-4 shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{t.revenueChart}</CardTitle>
                <CardDescription>{lang === 'en' ? "Monthly earnings breakdown" : "মাসিক আয়ের বিবরণ"}</CardDescription>
              </CardHeader>
              <CardContent className="pl-0">
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyStats || []}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* --- Quick Actions --- */}
            <Card className="lg:col-span-3 bg-slate-50/50 border-slate-200">
              <CardHeader>
                <CardTitle>{t.quickActions}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Link href="/dashboard/listings/create">
                  <Button className="w-full h-12 text-lg justify-start gap-3 shadow-sm bg-white text-slate-900 hover:bg-slate-50 border border-slate-200">
                    <div className="bg-primary/10 p-1 rounded-md"><PlusCircle className="h-5 w-5 text-primary" /></div> 
                    {t.createTour}
                  </Button>
                </Link>
                <Link href="/dashboard/bookings">
                  <Button className="w-full h-12 text-lg justify-start gap-3 shadow-sm bg-white text-slate-900 hover:bg-slate-50 border border-slate-200">
                    <div className="bg-orange-100 p-1 rounded-md"><CalendarDays className="h-5 w-5 text-orange-600" /></div>
                    {t.manageBookings}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* ==========================
          TOURIST DASHBOARD VIEW
         ========================== */}
      {role === "TOURIST" && (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard 
              title={t.trips} 
              value={stats.totalTrips} 
              icon={Map} 
              color="text-blue-600" 
              bg="bg-blue-50"
            />
            <StatsCard 
              title={t.spent} 
              value={`৳ ${stats.totalSpent?.toLocaleString()}`} 
              icon={TrendingUp} 
              color="text-green-600" 
              bg="bg-green-50"
            />
            <StatsCard 
              title={t.pending} 
              value={stats.pendingBookings} 
              icon={CreditCard} 
              color="text-yellow-600" 
              bg="bg-yellow-50"
              alert={stats.pendingBookings! > 0}
            />
          </div>

          {/* Spending Chart */}
          <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{t.spendingChart}</CardTitle>
              </CardHeader>
              <CardContent className="pl-0">
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyStats || []}>
                      <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
          </Card>

          {/* CTA */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2 border-dashed border-2 bg-slate-50/30 hover:bg-slate-50/80 transition-colors cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                   <Compass className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {lang === 'en' ? "Plan Your Next Adventure" : "আপনার পরবর্তী ভ্রমণ পরিকল্পনা করুন"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {lang === 'en' ? "Discover new cities and meet local experts." : "নতুন শহর আবিষ্কার করুন এবং লোকাল এক্সপার্টদের সাথে পরিচিত হোন।"}
                </p>
                <Link href="/explore">
                  <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                    {t.explore}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// Reusable Stats Card
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatsCard({ title, value, icon: Icon, color, bg, trend, alert }: any) {
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border-slate-200 group cursor-default ${alert ? 'border-l-4 border-l-orange-500' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">{title}</CardTitle>
        <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">{value || 0}</div>
        {trend && (
           <p className={`text-xs mt-2 font-medium flex items-center ${color} bg-white w-fit px-2 py-0.5 rounded-full shadow-sm`}>
              <ArrowUpRight className="h-3 w-3 mr-1" /> {trend}
           </p>
        )}
        {alert && <p className="text-xs text-orange-600 mt-2 font-bold bg-orange-50 w-fit px-2 py-0.5 rounded-full">Action required</p>}
      </CardContent>
    </Card>
  );
}