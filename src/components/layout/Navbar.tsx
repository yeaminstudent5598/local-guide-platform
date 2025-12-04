"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import MobileNav from "./MobileNav";
import { User, LogOut, LayoutDashboard, Map, Heart, Globe, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserPayload { id: string; email: string; role: string; name?: string; }

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // ✅ Multi-language State
  const [lang, setLang] = useState<"en" | "bn">("en");

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

  // Scroll Effect
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
    toast.success("Logged out");
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: lang === "en" ? "Home" : "হোম" },
    { href: "/explore", label: lang === "en" ? "Explore" : "এক্সপ্লোর" },
    { href: "/how-it-works", label: lang === "en" ? "How it Works" : "কিভাবে কাজ করে" },
  ];

  if (!mounted) return null;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-background/95 backdrop-blur-lg border-b shadow-sm" 
          : "bg-background/60 backdrop-blur-md"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Left Section - Logo & Nav */}
          <div className="flex items-center gap-8">
            <MobileNav />
            
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group"
            >
              <div className="relative">
                <Map className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                <Sparkles className="h-3 w-3 text-primary absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Vistara
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                    pathname === link.href 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            
            {/* Language Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              className="hidden sm:flex items-center gap-2 rounded-full hover:bg-primary/10"
            >
              <Globe className="h-4 w-4" />
              <span className="font-semibold">{lang === "en" ? "BN" : "EN"}</span>
            </Button>

            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "GUIDE" && (
                  <Link href="/dashboard/listings/create" className="hidden md:block">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Become a Guide
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1.5 p-2">
                        <p className="text-sm font-semibold truncate">{user.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit">
                          {user.role}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-3 h-4 w-4" /> 
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/profile" className="flex items-center">
                        <User className="mr-3 h-4 w-4" /> 
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "TOURIST" && (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard/bookings" className="flex items-center">
                          <Heart className="mr-3 h-4 w-4" /> 
                          My Trips
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" /> 
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    className="rounded-full hover:bg-primary/10"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;