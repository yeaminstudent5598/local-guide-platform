"use client";

import { useEffect, useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  DollarSign, Users, Map, CalendarCheck, Activity, 
  Loader2, ArrowUpRight, Download, TrendingUp, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { 
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// --- Types ---
interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyStats: { name: string; total: number }[];
}

interface ActivityLog {
  id: string;
  title: string;
  touristName: string;
  amount: number;
  createdAt: string;
  status: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Stats & Recent Activity
        const [statsRes, bookingsRes] = await Promise.all([
          fetch("/api/v1/admin/stats", { headers }),
          fetch("/api/v1/bookings", { headers })
        ]);

        const statsData = await statsRes.json();
        const bookingsData = await bookingsRes.json();

        if (statsData.success) setStats(statsData.data);
        
        if (bookingsData.success) {
          const logs = bookingsData.data.slice(0, 5).map((b: any) => ({
            id: b.id,
            title: b.listing.title,
            touristName: b.tourist.name,
            amount: b.totalAmount,
            createdAt: b.createdAt,
            status: b.status
          }));
          setRecentLogs(logs);
        }
      } catch (error) {
        toast.error("Failed to sync dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 🦴 Requirement 10: Skeleton Loader ---
  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 pt-6 max-w-7xl mx-auto bg-[#F8FAFB] min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
             <Sparkles className="h-3 w-3" /> Admin Terminal
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Platform <span className="text-emerald-600 italic font-serif">Insights</span></h2>
        </div>
        <Button className="bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl h-12 px-6 transition-all shadow-xl shadow-slate-200">
          <Download className="mr-2 h-4 w-4" /> Export Analytics
        </Button>
      </div>
      
      {/* --- Stats Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Revenue" value={`৳${stats?.totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+24%" color="emerald" />
        <StatCard title="Active Users" value={stats?.totalUsers} icon={Users} trend="+180" color="blue" />
        <StatCard title="Live Tours" value={stats?.totalListings} icon={Map} sub="Across 12 cities" color="purple" />
        <StatCard title="Bookings" value={stats?.totalBookings} icon={CalendarCheck} trend="+12%" color="orange" />
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-7">
        
        {/* --- Area Chart (Requirement 07) --- */}
        <Card className="col-span-1 lg:col-span-4 shadow-2xl shadow-slate-200/50 border-none rounded-[2.5rem] bg-white p-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Revenue Flow</CardTitle>
            <CardDescription>Visualizing monthly earning performance</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[350px] w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={stats?.monthlyStats}>
                   <defs>
                     <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8'}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8'}} tickFormatter={(v) => `৳${v}`} />
                   <Tooltip content={<CustomTooltip />} />
                   <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={4} fill="url(#colorRev)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
        
        {/* --- Recent Activity --- */}
        <Card className="col-span-1 lg:col-span-3 shadow-2xl shadow-slate-200/50 border-none rounded-[2.5rem] bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
            <CardDescription>Latest transactions in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
               {recentLogs.map((log) => (
                 <div key={log.id} className="flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm">
                        <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">{log.touristName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 leading-none">{log.title}</p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {log.touristName} • {formatDistanceToNow(new Date(log.createdAt))} ago
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-sm text-slate-900">৳{log.amount}</p>
                       <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter", 
                         log.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                       )}>{log.status}</span>
                    </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ title, value, icon: Icon, trend, sub, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-3 rounded-2xl transition-colors", colors[color])}>
            <Icon className="h-6 w-6" />
          </div>
          {trend && <span className="text-[10px] font-black bg-slate-50 text-slate-500 px-2 py-1 rounded-lg">{trend}</span>}
        </div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</h3>
        <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
        {sub && <p className="text-xs text-slate-400 mt-1 font-medium">{sub}</p>}
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-4 shadow-2xl rounded-2xl border-none">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">{label}</p>
        <p className="text-lg font-black italic">৳{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// --- 🦴 Requirement 10: Skeleton Component ---
function DashboardSkeleton() {
  return (
    <div className="p-10 space-y-10 animate-pulse bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="space-y-3"><div className="h-10 w-64 bg-slate-200 rounded-xl" /><div className="h-4 w-40 bg-slate-200 rounded-lg" /></div>
        <div className="h-12 w-32 bg-slate-200 rounded-2xl" />
      </div>
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-[2rem] shadow-sm" />)}
      </div>
      <div className="grid grid-cols-7 gap-8">
        <div className="col-span-4 h-[450px] bg-white rounded-[2.5rem]" />
        <div className="col-span-3 h-[450px] bg-white rounded-[2.5rem]" />
      </div>
    </div>
  );
}