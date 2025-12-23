"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import MobileNav from "./MobileNav";
import { 
  User, LogOut, LayoutDashboard, Map, Heart, Globe, 
  Sparkles, Compass, ShieldCheck, HelpCircle, 
  PhoneCall, Users, Mountain, Palmtree, MapPin 
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface UserPayload { id: string; email: string; role: string; name?: string; profileImage?: string; }

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
    toast.success(t?.logoutSuccess || (lang === "bn" ? "লগআউট সফল হয়েছে" : "Logged out"));
    router.push("/login");
  };

  if (!mounted) return null;

  const linkStyles = cn(
    "px-4 py-2 text-sm font-bold transition-all duration-300 rounded-lg drop-shadow-sm",
    scrolled ? "text-slate-800 hover:text-emerald-600" : "text-white hover:text-emerald-400 drop-shadow-md"
  );

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        scrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          
          {/* --- LEFT: Logo & Mega Menu --- */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 transition-transform group-hover:rotate-12">
                <Compass className="h-6 w-6" />
              </div>
              <span className={cn(
                "text-2xl font-black tracking-tighter transition-colors",
                scrolled ? "text-slate-900" : "text-white drop-shadow-lg"
              )}>
                Vistara<span className="text-emerald-500">.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  
                  {/* Explore */}
                  <NavigationMenuItem>
                    <Link href="/explore" legacyBehavior passHref>
                      <NavigationMenuLink className={linkStyles}>
                        {t?.explore || (lang === "bn" ? "অন্বেষণ" : "Explore")}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* Destinations Mega Menu */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                      "text-sm font-bold bg-transparent transition-all",
                      scrolled ? "text-slate-700 hover:text-emerald-600" : "text-white hover:text-emerald-400 drop-shadow-md"
                    )}>
                      {t?.destinations || (lang === "bn" ? "গন্তব্যসমূহ" : "Destinations")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] grid-cols-2 p-6 gap-4">
                        <div className="col-span-1 space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            {t?.popularSpots || (lang === "bn" ? "জনপ্রিয় স্থান" : "Popular Spots")}
                          </p>
                          <div className="grid gap-2">
                            <DestinationItem 
                              href="/explore?city=Sylhet" 
                              title={t?.sylhet || (lang === "bn" ? "সিলেট" : "Sylhet")} 
                              icon={Mountain} 
                              desc={t?.sylhetDesc || (lang === "bn" ? "চা বাগান ও জলপ্রপাত" : "Tea gardens & waterfalls")} 
                            />
                            <DestinationItem 
                              href="/explore?city=CoxsBazar" 
                              title={t?.coxsbazar || (lang === "bn" ? "কক্সবাজার" : "Cox's Bazar")} 
                              icon={Palmtree} 
                              desc={t?.coxsbazarDesc || (lang === "bn" ? "বিশ্বের দীর্ঘতম সৈকত" : "World's longest beach")} 
                            />
                            <DestinationItem 
                              href="/explore?city=Sajek" 
                              title={t?.sajek || (lang === "bn" ? "সাজেক ভ্যালি" : "Sajek Valley")} 
                              icon={Globe} 
                              desc={t?.sajekDesc || (lang === "bn" ? "মেঘের উপরে" : "Above the clouds")} 
                            />
                          </div>
                        </div>
                        <div className="col-span-1 bg-slate-50 rounded-2xl p-6 flex flex-col justify-center">
                            <h4 className="font-bold text-slate-900 mb-2">
                              {t?.promoTitle || (lang === "bn" ? "গ্রীষ্ম ২০২৫" : "Summer 2025")}
                            </h4>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                              {t?.promoDesc || (lang === "bn" ? "বাংলাদেশের লুকানো সৌন্দর্য আবিষ্কার করুন।" : "Discover the hidden beauty of remote Bangladesh.")}
                            </p>
                            <Link href="/explore">
                              <Button size="sm" className="bg-emerald-600 rounded-lg">
                                {t?.browseMap || (lang === "bn" ? "মানচিত্র ব্রাউজ করুন" : "Browse Map")}
                              </Button>
                            </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Find Guide */}
                  <NavigationMenuItem>
                    <Link href="/guides" legacyBehavior passHref>
                      <NavigationMenuLink className={linkStyles}>
                        {t?.findTour || (lang === "bn" ? "গাইড খুঁজুন" : "Find Guides")}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* Resources Mega Menu */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                      "text-sm font-bold bg-transparent transition-all",
                      scrolled ? "text-slate-700 hover:text-emerald-600" : "text-white hover:text-emerald-400 drop-shadow-md"
                    )}>
                      {t?.resources || (lang === "bn" ? "তথ্য ভান্ডার" : "Resources")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <ResourceItem 
                          href="/how-it-works" 
                          title={t?.howItWorks || (lang === "bn" ? "কিভাবে কাজ করে" : "How it Works")} 
                          icon={HelpCircle} 
                        />
                        <ResourceItem 
                          href="/about" 
                          title={t?.aboutMission || (lang === "bn" ? "আমাদের লক্ষ্য" : "Our Mission")} 
                          icon={ShieldCheck} 
                        />
                        <ResourceItem 
                          href="/contact" 
                          title={t?.supportCenter || (lang === "bn" ? "সহায়তা কেন্দ্র" : "Support Center")} 
                          icon={PhoneCall} 
                        />
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          {/* --- RIGHT: Language & Auth --- */}
          <div className="flex items-center gap-4">
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className={cn(
                "hidden sm:flex items-center gap-2 rounded-xl transition-all font-bold",
                scrolled ? "text-slate-600 hover:bg-emerald-50" : "text-white hover:bg-white/10"
              )}
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs">{lang === "en" ? "বাং" : "EN"}</span>
            </Button>

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === "GUIDE" && (
                  <Link href="/dashboard/listings/create" className="hidden xl:block">
                    <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-6 shadow-lg shadow-emerald-100 border-none transition-all">
                      <Sparkles className="mr-2 h-4 w-4" /> 
                      {t?.createTour || (lang === "bn" ? "ট্যুর তৈরি করুন" : "Create Tour")}
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                      <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-emerald-500/20">
                        <AvatarImage src={user.profileImage || "/placeholder-avatar.jpg"} />
                        <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className={cn(
                          "text-xs font-black leading-none transition-colors",
                          scrolled ? "text-slate-900" : "text-white drop-shadow-lg"
                        )}>
                          {user.name || (lang === "bn" ? "ব্যবহারকারী" : "User")}
                        </p>
                        <p className={cn(
                          "text-[10px] font-bold uppercase mt-1 tracking-wider transition-colors",
                          scrolled ? "text-emerald-600" : "text-white/80"
                        )}>
                          {user.role === "GUIDE" 
                            ? (lang === "bn" ? "গাইড" : "GUIDE")
                            : user.role === "TRAVELER"
                            ? (lang === "bn" ? "ভ্রমণকারী" : "TRAVELER")
                            : user.role}
                        </p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 rounded-2xl shadow-2xl border-slate-100 p-2" align="end">
                    <DropdownMenuLabel className="px-3 py-2">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                          {t?.personalHub || (lang === "bn" ? "ব্যক্তিগত হাব" : "Personal Hub")}
                        </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem asChild className="rounded-xl py-2.5 cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><LayoutDashboard className="h-4 w-4" /></div>
                        <span className="font-bold text-slate-700 text-sm">
                          {t?.dashboard || (lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard")}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl py-2.5 cursor-pointer">
                      <Link href="/dashboard/profile" className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><User className="h-4 w-4" /></div>
                        <span className="font-bold text-slate-700 text-sm">
                          {t?.profile || (lang === "bn" ? "আমার প্রোফাইল" : "My Profile")}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-2.5 cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50">
                      <div className="flex items-center gap-3 w-full font-bold text-sm">
                        <div className="p-2 bg-rose-50 rounded-lg"><LogOut className="h-4 w-4" /></div>
                        {t?.logout || (lang === "bn" ? "সাইন আউট" : "Sign Out")}
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={cn(
                      "rounded-xl font-bold px-6",
                      scrolled ? "text-slate-600 hover:bg-emerald-50" : "text-white hover:bg-white/10"
                    )}
                  >
                    {t?.login || (lang === "bn" ? "লগইন" : "Login")}
                  </Button>
                </Link>

                <Link href="/register">
                  <Button className="rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold h-11 px-8 shadow-xl shadow-slate-200 transition-all border-none">
                    {t?.join || (lang === "bn" ? "Vistara এ যোগ দিন" : "Join Vistara")}
                  </Button>
                </Link>
              </div>
            )}
            <div className="lg:hidden">
                <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Helper Components ---
const DestinationItem = ({ href, title, icon: Icon, desc }: any) => (
  <Link href={href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50 transition-all group">
    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm font-bold text-slate-900 leading-none">{title}</p>
      <p className="text-[10px] text-slate-400 mt-1 font-medium">{desc}</p>
    </div>
  </Link>
);

const ResourceItem = ({ href, title, icon: Icon }: any) => (
  <li>
    <Link href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group">
      <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition-colors">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-bold text-slate-700">{title}</span>
    </Link>
  </li>
);

export default Navbar;