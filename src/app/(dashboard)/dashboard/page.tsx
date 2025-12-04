"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  Map, 
  CalendarDays, 
  TrendingUp, 
  CreditCard,
  Activity,
  PlusCircle,
  Compass
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

// Interface for Stats Data Structure
interface DashboardStats {
  // Guide Specific
  totalEarnings?: number;
  totalListings?: number;
  totalBookings?: number;
  activeBookings?: number; // Pending requests
  
  // Tourist Specific
  totalTrips?: number;
  totalSpent?: number;
  pendingBookings?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    // 1. Auth Check
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // 2. Decode Token
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
      setUserName(payload.name || "User");
      
      // 3. Admin Redirect (Admins have their own dashboard)
      if (payload.role === "ADMIN") {
        router.replace("/dashboard/admin");
        return;
      }

      // 4. Fetch Statistics
      fetchStats(token);

    } catch (e) {
      console.error("Token Error:", e);
      localStorage.removeItem("accessToken");
      router.push("/login");
    }
  }, [router]);

  const fetchStats = async (token: string) => {
    try {
      const res = await fetch("/api/v1/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        // Silent fail or minimal toast, don't block UI
        console.error("Failed to load stats data");
      }
    } catch (error) {
      console.error("Stats fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* --- Welcome Header --- */}
      <div className="flex flex-col gap-1 border-b pb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {userName} 👋
        </h2>
        <p className="text-muted-foreground">
          Here is what&apos;s happening with your account today.
        </p>
      </div>

      {/* ==========================
          GUIDE DASHBOARD VIEW
         ========================== */}
      {role === "GUIDE" && stats && (
        <>
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-all border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Earnings</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳ {stats.totalEarnings || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Lifetime revenue</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Listings</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Map className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalListings || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Tours currently live</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Bookings</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Served tourists</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all border-l-4 border-l-orange-500 bg-orange-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Pending Requests</CardTitle>
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <CalendarDays className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">{stats.activeBookings || 0}</div>
                <p className="text-xs text-orange-600/80 mt-1">Needs attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" /> 
                  Platform Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50">
                  <p className="font-medium">Analytics Chart</p>
                  <span className="text-xs">Your earnings data will appear here</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3 bg-primary/5 border-primary/10">
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
            <Card className="hover:shadow-md transition-all border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Trips</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Map className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTrips || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Confirmed journeys</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Spent</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳ {stats.totalSpent || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Invested in memories</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all border-l-4 border-l-yellow-500 bg-yellow-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">Pending Bookings</CardTitle>
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <CreditCard className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700">{stats.pendingBookings || 0}</div>
                <p className="text-xs text-yellow-600/80 mt-1">Awaiting confirmation/payment</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2 border-dashed border-2 bg-slate-50/50">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Plan Your Next Adventure</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Compass className="h-16 w-16 text-primary/40 mb-4 animate-pulse" />
                <p className="text-muted-foreground mb-6 max-w-md">
                  Discover new cities, meet local experts, and create unforgettable memories. 
                  Hundreds of tours are waiting for you.
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