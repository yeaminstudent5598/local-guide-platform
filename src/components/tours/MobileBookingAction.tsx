"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import BookingWidget from "./BookingWidget";
import { useState } from "react";
import { Zap, Calendar } from "lucide-react";

export default function MobileBookingAction({ tour }: { tour: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-5 px-6 flex justify-between items-center z-50 safe-area-pb shadow-2xl">
      <div className="space-y-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tighter">৳{tour.tourFee.toLocaleString()}</span>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">/ total</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
           <Zap className="h-3 w-3 fill-emerald-500" /> Instant Confirm
        </div>
      </div>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="lg" className="px-10 rounded-2xl bg-slate-950 hover:bg-emerald-600 text-white font-bold h-14 shadow-xl border-none">
            Reserve Now
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-[3rem] p-0 overflow-y-auto border-none shadow-2xl">
          <SheetTitle className="sr-only">Reserve Expedition</SheetTitle>
          <div className="p-6 pt-12 pb-32">
            <div className="flex items-center justify-center mb-8">
               <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>
            <BookingWidget 
              listingId={tour.id} 
              price={tour.tourFee} 
              maxGroupSize={tour.maxGroupSize} 
              blockedDates={tour.unavailableDates || []}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}