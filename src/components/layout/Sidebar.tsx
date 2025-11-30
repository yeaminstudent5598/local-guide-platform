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
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  
  // TODO: Get role from Auth Context or Token
  const userRole = "GUIDE"; // "TOURIST" | "GUIDE" | "ADMIN" (Change this to test)

  const commonRoutes = [
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const touristRoutes = [
    { href: "/dashboard/bookings", label: "My Trips", icon: Map },
    { href: "/dashboard/wishlist", label: "Wishlist", icon: List },
  ];

  const guideRoutes = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/listings", label: "My Listings", icon: List },
    { href: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/dashboard/earnings", label: "Earnings", icon: CreditCard },
  ];

  const adminRoutes = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/listings", label: "Manage Listings", icon: List },
  ];

  let routes = commonRoutes;

  if (userRole === "TOURIST") routes = [...touristRoutes, ...commonRoutes];
  if (userRole === "GUIDE") routes = [...guideRoutes, ...commonRoutes];
  if (userRole === "ADMIN") routes = [...adminRoutes, ...commonRoutes];

  return (
    <div className="flex flex-col h-full border-r bg-slate-50/50">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          Vistara
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:text-primary",
              pathname === route.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-slate-100"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;