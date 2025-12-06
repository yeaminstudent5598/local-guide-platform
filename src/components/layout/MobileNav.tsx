"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, LayoutDashboard, Map, Heart, Sparkles, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Import

interface UserPayload {
  id: string;
  email: string;
  role: string;
  name?: string;
}

const MobileNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserPayload | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // ✅ Language Hook
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) { localStorage.removeItem("accessToken"); }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
    toast.success("Logged out");
    router.push("/login");
    setIsOpen(false);
  };

  const routes = [
    { href: "/", label: t.home },
    { href: "/explore", label: t.explore },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/about", label: "About Us" },
  ];

  if (!mounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden hover:bg-slate-100 rounded-full">
          <Menu className="h-6 w-6 text-slate-700" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-6 flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Map className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl font-bold text-slate-900">Vistara</span>
            </div>
            {/* Language Toggle in Mobile */}
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLang(lang === "en" ? "bn" : "en")}
                className="rounded-full hover:bg-primary/10"
            >
                <Globe className="h-4 w-4 mr-1" />
                {lang === "en" ? "BN" : "EN"}
            </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 flex-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all",
                pathname === route.href
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* User Section / Auth Buttons */}
        <div className="mt-auto pt-6 border-t border-slate-100">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2 mb-4">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user.name || "User"}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2 h-10 px-3">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2 h-10 px-3">
                    <User className="h-4 w-4" /> Profile
                  </Button>
                </Link>
              </div>

              {user.role === "GUIDE" && (
                <Link href="/dashboard/listings/create" onClick={() => setIsOpen(false)}>
                  <Button className="w-full gap-2 bg-gradient-to-r from-primary to-primary/90">
                    <Sparkles className="h-4 w-4" /> Become a Guide
                  </Button>
                </Link>
              )}

              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Log out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-11 text-base font-medium border-slate-300">
                  {t.login}
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-11 text-base font-bold shadow-lg shadow-primary/20">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          )}
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;