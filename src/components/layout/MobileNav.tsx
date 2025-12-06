"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Menu, LogOut, User, LayoutDashboard, Map, Heart, Sparkles, 
  Globe, Home, Compass, Info, ChevronRight, Settings 
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Separator } from "@/components/ui/separator";

// User Payload Interface
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

  // Auth Check
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
    toast.success(lang === 'en' ? "Logged out" : "লগআউট সফল");
    router.push("/login");
    setIsOpen(false);
  };

  // Menu Items
  const menuItems = [
    { href: "/", label: t.home, icon: Home },
    { href: "/explore", label: t.explore, icon: Compass },
    { href: "/how-it-works", label: lang === 'en' ? "How it Works" : "কিভাবে কাজ করে", icon: Info },
  ];

  // Dashboard Items
  const dashboardItems = [
    { href: "/dashboard", label: lang === 'en' ? "Dashboard" : "ড্যাশবোর্ড", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: lang === 'en' ? "Profile" : "প্রোফাইল", icon: User },
    ...(user?.role === "TOURIST" ? [{ href: "/dashboard/bookings", label: lang === 'en' ? "My Trips" : "আমার ভ্রমণ", icon: Heart }] : []),
    { href: "/dashboard/settings", label: lang === 'en' ? "Settings" : "সেটিংস", icon: Settings },
  ];

  if (!mounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-slate-100 active:bg-slate-200">
          <Menu className="h-6 w-6 text-slate-800" />
        </Button>
      </SheetTrigger>
      
      {/* App Style Drawer */}
      <SheetContent side="left" className="w-[320px] p-0 flex flex-col bg-slate-50 border-r-0">
        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
        
        {/* --- 1. User Header (App Like) --- */}
        <div className="bg-white p-6 pb-8 border-b border-slate-100">
          {user ? (
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-sm">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                  {user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-900 truncate">{user.name || "User"}</h3>
                <p className="text-xs text-slate-500 truncate mb-1">{user.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
               <div className="text-xl font-bold text-slate-900 mb-1">
                  {lang === 'en' ? "Welcome to Vistara" : "ভিস্টারায় স্বাগতম"}
               </div>
               <p className="text-sm text-slate-500 mb-2">
                  {lang === 'en' ? "Sign in to book tours and manage trips." : "ট্যুর বুক করতে লগিন করুন।"}
               </p>
               <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl border-slate-300">{t.login}</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-xl shadow-md shadow-primary/20">Sign Up</Button>
                  </Link>
               </div>
            </div>
          )}
        </div>

        {/* --- 2. Scrollable Menu List --- */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          
          {/* Main Menu */}
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
               {lang === 'en' ? "Menu" : "মেনু"}
            </p>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95",
                  pathname === item.href
                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-100"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                   <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-slate-400")} />
                   {item.label}
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </Link>
            ))}
          </div>

          {/* User Dashboard Menu (If Logged In) */}
          {user && (
             <div className="space-y-1">
               <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {lang === 'en' ? "Account" : "অ্যাকাউন্ট"}
               </p>
               
               {user.role === "GUIDE" && (
                  <Link href="/dashboard/listings/create" onClick={() => setIsOpen(false)}>
                    <div className="mx-2 mb-2 p-3 bg-gradient-to-r from-primary to-blue-600 rounded-xl text-white shadow-lg shadow-blue-200 flex items-center justify-center gap-2 font-semibold active:scale-95 transition-transform">
                       <Sparkles className="h-4 w-4" /> 
                       {lang === 'en' ? "Create New Tour" : "নতুন ট্যুর তৈরি করুন"}
                    </div>
                  </Link>
               )}

               {dashboardItems.map((item) => (
                 <Link
                   key={item.href}
                   href={item.href}
                   onClick={() => setIsOpen(false)}
                   className={cn(
                     "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95",
                     pathname === item.href
                       ? "bg-white text-primary shadow-sm ring-1 ring-slate-100"
                       : "text-slate-600 hover:bg-white hover:text-slate-900"
                   )}
                 >
                   <div className="flex items-center gap-3">
                      <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-slate-400")} />
                      {item.label}
                   </div>
                 </Link>
               ))}
             </div>
          )}
        </div>

        {/* --- 3. Footer Actions --- */}
        <div className="p-4 bg-white border-t border-slate-100 space-y-3">
          
          {/* Language Switcher */}
          <div className="flex items-center justify-between px-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
             <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Globe className="h-4 w-4" /> Language
             </div>
             <div className="flex bg-white rounded-md p-1 shadow-sm border border-slate-200">
                <button 
                   onClick={() => setLang("en")} 
                   className={cn("px-3 py-1 rounded text-xs font-bold transition-colors", lang === "en" ? "bg-slate-900 text-white" : "text-slate-500")}
                >EN</button>
                <button 
                   onClick={() => setLang("bn")} 
                   className={cn("px-3 py-1 rounded text-xs font-bold transition-colors", lang === "bn" ? "bg-slate-900 text-white" : "text-slate-500")}
                >BN</button>
             </div>
          </div>

          {/* Logout */}
          {user && (
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 h-12 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" /> {lang === 'en' ? "Log out" : "লগআউট"}
            </Button>
          )}
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;