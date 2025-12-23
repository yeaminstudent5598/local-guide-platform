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
  User, LogOut, LayoutDashboard, Compass, Globe, 
  Sparkles, HelpCircle, PhoneCall, Mountain, Palmtree, ChevronDown 
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageProvider";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
      } catch (error) { 
        localStorage.removeItem("accessToken"); 
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
    toast.success("Logged out");
    router.push("/login");
  };

  if (!mounted) return null;

  // টেক্সট কালার লজিক (স্ক্রল অনুযায়ী)
  const linkStyles = cn(
    "px-4 py-2 text-sm font-bold transition-all duration-300 rounded-lg",
    scrolled ? "text-slate-800 hover:text-emerald-600" : "text-white hover:text-emerald-400 drop-shadow-md"
  );

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        scrolled 
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-100 py-3 shadow-md" 
          : "bg-gradient-to-b from-black/60 to-transparent py-5" // টেক্সট স্পষ্ট করার জন্য ডার্ক মাস্ক
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          
          {/* --- বাম পাশ: লোগো এবং মেগা মেনু --- */}
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

            <nav className="hidden lg:block">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  <NavigationMenuItem>
                    <Link href="/explore" legacyBehavior passHref>
                      <NavigationMenuLink className={linkStyles}>Explore</NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* মেগা মেনু আইটেম */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={cn(
                      "text-sm font-bold bg-transparent transition-all",
                      scrolled ? "text-slate-700 hover:text-emerald-600" : "text-white hover:text-emerald-400 drop-shadow-md"
                    )}>
                      Destinations
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] grid-cols-2 p-6 gap-4 bg-white rounded-2xl">
                        <div className="col-span-1 space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-2">Top Picks</p>
                          <DestinationItem href="/explore?city=Sylhet" title="Sylhet" icon={Mountain} desc="Tea garden capital" />
                          <DestinationItem href="/explore?city=CoxsBazar" title="Cox's Bazar" icon={Palmtree} desc="World's longest beach" />
                        </div>
                        <div className="col-span-1 bg-emerald-50/50 rounded-2xl p-6 border border-emerald-50 flex flex-col justify-center">
                            <h4 className="font-bold text-emerald-900 mb-2">Join Expedition</h4>
                            <p className="text-xs text-emerald-700 mb-4 leading-relaxed font-medium">Book local guides for an authentic experience.</p>
                            <Link href="/explore"><Button size="sm" className="bg-emerald-600 w-full rounded-xl font-bold">Browse All</Button></Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/guides" legacyBehavior passHref>
                      <NavigationMenuLink className={linkStyles}>Find Guides</NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          {/* --- ডান পাশ: ভাষা এবং ইউজার প্রোফাইল --- */}
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
              <span className="text-xs uppercase">{lang === "en" ? "BN" : "EN"}</span>
            </Button>

            {user ? (
              <UserMenu user={user} scrolled={scrolled} handleLogout={handleLogout} />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className={cn(
                    "rounded-xl font-bold px-6",
                    scrolled ? "text-slate-600 hover:bg-emerald-50" : "text-white hover:bg-white/10"
                  )}>Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-8 shadow-xl shadow-emerald-500/20 transition-all border-none">
                    Join Vistara
                  </Button>
                </Link>
              </div>
            )}
            <div className="lg:hidden"><MobileNav /></div>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- হেল্পার কম্পোনেন্ট ১: DestinationItem (এটি আপনার ফাইলে মিসিং ছিল) ---
const DestinationItem = ({ href, title, icon: Icon, desc }: any) => (
  <Link href={href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50 transition-all group">
    <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
      <Icon className="h-5 w-5 stroke-[2.5px]" />
    </div>
    <div>
      <p className="text-sm font-bold text-slate-900 leading-none">{title}</p>
      <p className="text-[10px] text-slate-400 mt-1 font-medium">{desc}</p>
    </div>
  </Link>
);

// --- হেল্পার কম্পোনেন্ট ২: UserMenu ---
const UserMenu = ({ user, scrolled, handleLogout }: any) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className={cn(
        "flex items-center gap-3 p-1 pr-3 rounded-full border transition-all",
        scrolled ? "bg-slate-50 border-slate-200" : "bg-white/10 border-white/20 backdrop-blur-md"
      )}>
        <Avatar className="h-9 w-9 border-2 border-emerald-500">
          <AvatarImage src={user.profileImage || "https://i.ibb.co/5GzXkwq/user-placeholder.png"} />
          <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <p className={cn("text-xs font-bold leading-none", scrolled ? "text-slate-900" : "text-white")}>{user.name || "User"}</p>
          <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1 tracking-widest">{user.role}</p>
        </div>
        <ChevronDown className={cn("h-3 w-3", scrolled ? "text-slate-400" : "text-white/60")} />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-64 mt-2 rounded-2xl shadow-2xl p-2 border-slate-100" align="end">
      <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">Account Hub</DropdownMenuLabel>
      <DropdownMenuItem asChild className="rounded-xl py-2.5 cursor-pointer font-bold">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><LayoutDashboard className="h-4 w-4" /></div>
          Dashboard
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="my-1 bg-slate-50" />
      <DropdownMenuItem onClick={handleLogout} className="rounded-xl py-2.5 cursor-pointer text-rose-600 font-bold hover:bg-rose-50">
        <div className="p-2 bg-rose-50 rounded-lg mr-3"><LogOut className="h-4 w-4" /></div>
        Sign Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default Navbar;