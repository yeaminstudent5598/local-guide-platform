"use client";

import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  List, 
  User, 
  Settings, 
  LogOut,
  CalendarDays,
  CreditCard,
  Users,
  Compass,
  CalendarOff,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role);
      } catch (e) {
        console.error("Token decode failed", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    toast.success("Logged out");
    router.push("/login");
  };

  const commonRoutes = [
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const touristRoutes = [
    { href: "/dashboard/bookings", label: "My Trips", icon: Map },
    { href: "/dashboard/reviews", label: "My Reviews", icon: MessageSquare },
    { href: "/explore", label: "Explore Tours", icon: Compass },
  ];

  const guideRoutes = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/listings", label: "My Listings", icon: List },
    { href: "/dashboard/bookings", label: "Booking Requests", icon: CalendarDays },
    { href: "/dashboard/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/dashboard/availability", label: "Availability", icon: CalendarOff },
    { href: "/dashboard/earnings", label: "Earnings", icon: CreditCard },
  ];

  const adminRoutes = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/listings", label: "Manage Listings", icon: List },
    { href: "/dashboard/admin/bookings", label: "Manage Bookings", icon: CalendarDays }, // ✨ Added this
  ];

  let routes = commonRoutes;

  if (role === "TOURIST") routes = [...touristRoutes, ...commonRoutes];
  if (role === "GUIDE") routes = [...guideRoutes, ...commonRoutes];
  if (role === "ADMIN") routes = [...adminRoutes, ...commonRoutes];

  return (
    <div className="flex flex-col h-full border-r bg-white/50 backdrop-blur-xl">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Map className="h-6 w-6" />
          Vistara
        </Link>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === route.href
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <route.icon className={cn("h-4 w-4", pathname === route.href ? "text-white" : "text-slate-500")} />
            {route.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t bg-slate-50/50">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;