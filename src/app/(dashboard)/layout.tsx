import Sidebar from "@/components/layout/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Map } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* --- DESKTOP SIDEBAR (Visible only on md+) --- */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r bg-white">
        <Sidebar />
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        
        {/* --- MOBILE HEADER (Visible only on Mobile) --- */}
        <header className="md:hidden h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
           <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <Map className="h-6 w-6" /> Vistara
           </Link>

           {/* Mobile Sidebar Trigger */}
           <Sheet>
             <SheetTrigger asChild>
               <Button variant="ghost" size="icon">
                 <Menu className="h-6 w-6 text-slate-700" />
               </Button>
             </SheetTrigger>
             <SheetContent side="left" className="p-0 w-64 border-r">
                {/* Reuse existing Sidebar component inside Sheet */}
                <Sidebar />
             </SheetContent>
           </Sheet>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}