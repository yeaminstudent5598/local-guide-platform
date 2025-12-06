"use client";

import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  Map, 
  CalendarCheck, 
  Activity, 
  Loader2, 
  ArrowUpRight, 
  Download,
  MoreHorizontal,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,

} from "recharts";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


// --- Interfaces ---
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

// --- Custom Tooltip Component ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-xl font-bold text-slate-900">
          ৳ {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Stats
        const statsRes = await fetch("/api/v1/admin/stats", { headers });
        const statsData = await statsRes.json();
        
        // 2. Fetch Recent Bookings (For Logs)
        const bookingsRes = await fetch("/api/v1/bookings", { headers });
        const bookingsData = await bookingsRes.json();

        if (statsData.success) setStats(statsData.data);
        
        if (bookingsData.success) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        console.error("Dashboard Error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm animate-pulse">Syncing data...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto bg-slate-50/50 min-h-screen">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Overview</h2>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back! Here's your platform's performance summary.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      {/* --- Stats Cards --- */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Revenue Card */}
          <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
              <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
                 <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">৳ {stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center font-medium bg-green-50 w-fit px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" /> +24.5%
              </p>
            </CardContent>
          </Card>

          {/* Users Card */}
          <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
              <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                 <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-blue-600 mt-1 flex items-center font-medium bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +180 new
              </p>
            </CardContent>
          </Card>

          {/* Listings Card */}
          <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Live Tours</CardTitle>
              <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center">
                 <Map className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalListings}</div>
              <p className="text-xs text-slate-500 mt-1">Across 12 cities</p>
            </CardContent>
          </Card>

          {/* Bookings Card */}
          <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Bookings</CardTitle>
              <div className="h-9 w-9 rounded-lg bg-orange-50 flex items-center justify-center">
                 <CalendarCheck className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalBookings}</div>
              <p className="text-xs text-orange-600 mt-1 flex items-center font-medium bg-orange-50 w-fit px-2 py-0.5 rounded-full">
                 <Activity className="h-3 w-3 mr-1" /> +12% this week
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-7">
        
        {/* --- Beautiful Area Chart --- */}
        <Card className="col-span-1 lg:col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="text-lg font-bold text-slate-900">Revenue Analytics</CardTitle>
                    <CardDescription>Monthly earnings performance</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs">View Report</Button>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
             {stats?.monthlyStats && stats.monthlyStats.length > 0 ? (
               <div className="h-[350px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={stats.monthlyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <XAxis 
                       dataKey="name" 
                       stroke="#64748b" 
                       fontSize={12} 
                       tickLine={false} 
                       axisLine={false} 
                       dy={10}
                     />
                     <YAxis 
                       stroke="#64748b" 
                       fontSize={12} 
                       tickLine={false} 
                       axisLine={false} 
                       tickFormatter={(value) => `৳${value}`} 
                       dx={-10}
                     />
                     <Tooltip content={<CustomTooltip />} />
                     <Area 
                       type="monotone" 
                       dataKey="total" 
                       stroke="#3b82f6" 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorRevenue)" 
                     />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
             ) : (
               <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground bg-slate-50/50 rounded-lg border border-dashed border-slate-200 m-4">
                 <Activity className="h-10 w-10 text-slate-300 mb-2" />
                 <p>No revenue data available yet.</p>
               </div>
             )}
          </CardContent>
        </Card>
        
        {/* --- Recent Activity List --- */}
        <Card className="col-span-1 lg:col-span-3 shadow-sm border-slate-200 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Recent Activity</CardTitle>
            <CardDescription>Latest bookings and transactions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="space-y-6 pr-2 max-h-[400px] overflow-y-auto custom-scrollbar">
               {recentLogs.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full py-10 text-slate-400">
                    <p>No activity yet</p>
                 </div>
               ) : (
                 recentLogs.map((log) => (
                   <div key={log.id} className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-slate-100">
                            <AvatarFallback className="bg-slate-100 text-primary font-bold">
                                {log.touristName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                             {log.title}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            by <span className="font-medium text-slate-700">{log.touristName}</span>
                            • {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-sm text-slate-900">৳{log.amount}</div>
                         <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${
                             log.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                             log.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
                         }`}>
                            {log.status}
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}