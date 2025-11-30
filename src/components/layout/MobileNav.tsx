"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();

  const routes = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore Tours" },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 mt-10">
          <Link href="/" className="text-2xl font-bold text-primary">
            Vistara
          </Link>
          <nav className="flex flex-col gap-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === route.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 mt-4">
             {/* Auth logic pore add hobe, ekhon placeholder */}
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;