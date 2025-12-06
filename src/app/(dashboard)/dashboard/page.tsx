"use client";

import { useEffect, useState } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  DollarSign, Users, Map, CalendarDays, TrendingUp, 
  CreditCard, Activity, PlusCircle, Compass, ArrowUpRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid 
} from "recharts";

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
  recentActivity?: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role);
        setUserName(payload.name || "User");
        
        if (payload.role === "ADMIN") {
          router.replace("/dashboard/admin");
          return;
        }

        // Fetch Stats
        const res = await fetch("/api/v1/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (data.success) {
          setStats(data.data);
        } else {
          console.error("Failed to load stats");
        }
      } catch (e) {
        console.error("Error:", e);
        localStorage.removeItem("accessToken");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <div className="flex h-[80vh] items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 p-2 md:p-4">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {userName} 👋
          </h2>
          <p className="text-muted-foreground">
            Here is your activity overview for today.
          </p>
        </div>
        <div className="flex gap-3">
           <Link href="/dashboard/profile">
              <Button variant="outline">Edit Profile</Button>
           </Link>
           {role === "GUIDE" ? (
              <Link href="/dashboard/listings/create">
                 <Button className="shadow-lg shadow-primary/20">Create Listing</Button>
              </Link>
           ) : (
              <Link href="/explore">
                 <Button className="shadow-lg shadow-primary/20">Find Tours</Button>
              </Link>
           )}
        </div>
      </div>

      {/* ==========================
          GUIDE DASHBOARD VIEW
         ========================== */}
      {role === "GUIDE" && stats && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Earnings" 
              value={`৳ ${stats.totalEarnings?.toLocaleString()}`} 
              icon={DollarSign} 
              color="text-green-600" 
              bg="bg-green-50"
              trend="+12% from last month"
            />
            <StatsCard 
              title="Active Listings" 
              value={stats.totalListings} 
              icon={Map} 
              color="text-blue-600" 
              bg="bg-blue-50"
            />
            <StatsCard 
              title="Total Bookings" 
              value={stats.totalBookings} 
              icon={Users} 
              color="text-purple-600" 
              bg="bg-purple-50"
            />
            <StatsCard 
              title="Pending Requests" 
              value={stats.activeBookings} 
              icon={CalendarDays} 
              color="text-orange-600" 
              bg="bg-orange-50"
              alert={stats.activeBookings! > 0}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
            
            {/* --- Earnings Chart --- */}
            <Card className="lg:col-span-4 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly earnings breakdown</CardDescription>
              </CardHeader>
              <CardContent className="pl-0">
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyStats || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                      <Tooltip />
                      <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* --- Quick Actions --- */}
            <Card className="lg:col-span-3 bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Link href="/dashboard/listings/create">
                  <Button className="w-full h-12 text-lg justify-start gap-3 shadow-md">
                    <PlusCircle className="h-5 w-5" /> Create New Listing
                  </Button>
                </Link>
                <Link href="/dashboard/bookings">
                  <Button variant="outline" className="w-full h-12 text-lg justify-start gap-3 bg-white hover:bg-slate-50">
                    <CalendarDays className="h-5 w-5" /> Manage Bookings
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
      {role === "TOURIST" && stats && (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard 
              title="Total Trips" 
              value={stats.totalTrips} 
              icon={Map} 
              color="text-blue-600" 
              bg="bg-blue-50"
            />
            <StatsCard 
              title="Total Spent" 
              value={`৳ ${stats.totalSpent?.toLocaleString()}`} 
              icon={TrendingUp} 
              color="text-green-600" 
              bg="bg-green-50"
            />
            <StatsCard 
              title="Pending Bookings" 
              value={stats.pendingBookings} 
              icon={CreditCard} 
              color="text-yellow-600" 
              bg="bg-yellow-50"
              alert={stats.pendingBookings! > 0}
            />
          </div>

          {/* --- Spending Chart for Tourist --- */}
          <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Spending Analytics</CardTitle>
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
                      <Tooltip />
                      <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2 border-dashed border-2 bg-slate-50/50">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Plan Your Next Adventure</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Compass className="h-16 w-16 text-primary/40 mb-4 animate-pulse" />
                <p className="text-muted-foreground mb-6 max-w-md">
                  Discover new cities, meet local experts, and create unforgettable memories.
                </p>
                <Link href="/explore">
                  <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    Explore Tours
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

// Reusable Stats Card Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatsCard({ title, value, icon: Icon, color, bg, trend, alert }: any) {
  return (
    <Card className={`hover:shadow-md transition-all duration-200 border-slate-200 ${alert ? 'border-l-4 border-l-orange-500' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value || 0}</div>
        {trend && (
           <p className={`text-xs mt-1 font-medium flex items-center ${color}`}>
              <ArrowUpRight className="h-3 w-3 mr-1" /> {trend}
           </p>
        )}
        {alert && <p className="text-xs text-orange-600 mt-1 font-medium">Action required</p>}
      </CardContent>
    </Card>
  );
}