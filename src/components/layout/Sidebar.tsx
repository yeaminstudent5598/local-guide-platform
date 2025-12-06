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
  MessageSquare,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Language Hook

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const { lang } = useLanguage(); // ✅ Use Language Hook

  // Translations
  const t = {
    profile: lang === 'en' ? "Profile" : "প্রোফাইল",
    settings: lang === 'en' ? "Settings" : "সেটিংস",
    myTrips: lang === 'en' ? "My Trips" : "আমার ভ্রমণ",
    myReviews: lang === 'en' ? "My Reviews" : "আমার রিভিউ",
    explore: lang === 'en' ? "Explore Tours" : "ট্যুর খুঁজুন",
    overview: lang === 'en' ? "Overview" : "ওভারভিউ",
    listings: lang === 'en' ? "My Listings" : "আমার লিস্টিং",
    requests: lang === 'en' ? "Booking Requests" : "বুকিং রিকোয়েস্ট",
    reviews: lang === 'en' ? "Reviews" : "রিভিউ",
    availability: lang === 'en' ? "Availability" : "সময়সূচী",
    earnings: lang === 'en' ? "Earnings" : "উপার্জন",
    users: lang === 'en' ? "Manage Users" : "ব্যবহারকারী",
    manageListings: lang === 'en' ? "Manage Listings" : "লিস্টিং ম্যানেজ",
    manageBookings: lang === 'en' ? "Manage Bookings" : "বুকিং ম্যানেজ",
    logout: lang === 'en' ? "Logout" : "লগআউট",
  };

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
    toast.success(t.logout);
    router.push("/login");
  };

  // Define Routes
  const commonRoutes = [
    { href: "/dashboard/profile", label: t.profile, icon: User },
    { href: "/dashboard/settings", label: t.settings, icon: Settings },
  ];

  const touristRoutes = [
    { href: "/dashboard/bookings", label: t.myTrips, icon: Map },
    { href: "/dashboard/reviews", label: t.myReviews, icon: MessageSquare },
    { href: "/explore", label: t.explore, icon: Compass },
  ];

  const guideRoutes = [
    { href: "/dashboard", label: t.overview, icon: LayoutDashboard },
    { href: "/dashboard/listings", label: t.listings, icon: List },
    { href: "/dashboard/bookings", label: t.requests, icon: CalendarDays },
    { href: "/dashboard/reviews", label: t.reviews, icon: MessageSquare },
    { href: "/dashboard/availability", label: t.availability, icon: CalendarOff },
    { href: "/dashboard/earnings", label: t.earnings, icon: CreditCard },
  ];

  const adminRoutes = [
    { href: "/dashboard/admin", label: t.overview, icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: t.users, icon: Users },
    { href: "/dashboard/admin/listings", label: t.manageListings, icon: List },
    { href: "/dashboard/admin/bookings", label: t.manageBookings, icon: CalendarDays },
  ];

  let routes = commonRoutes;
  if (role === "TOURIST") routes = [...touristRoutes, ...commonRoutes];
  if (role === "GUIDE") routes = [...guideRoutes, ...commonRoutes];
  if (role === "ADMIN") routes = [...adminRoutes, ...commonRoutes];

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm">
      
      {/* Header */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Map className="h-6 w-6" />
          Vistara
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary/5 text-primary" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
              
              <route.icon 
                className={cn(
                  "h-5 w-5 transition-colors", 
                  isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                )} 
              />
              {route.label}
            </Link>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3 font-medium"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {t.logout}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;