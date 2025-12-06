"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import BookingWidget from "./BookingWidget";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MobileBookingAction({ tour }: { tour: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-6 flex justify-between items-center z-50 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      
      {/* Price Info */}
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-slate-900">৳{tour.tourFee}</span>
          <span className="text-slate-500 text-sm">/ person</span>
        </div>
        <div className="text-xs font-medium underline mt-0.5 text-slate-400">
            Available dates
        </div>
      </div>
      
      {/* Drawer / Sheet Logic */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            size="lg" 
            className="px-8 font-bold bg-primary hover:bg-primary/90 h-12 rounded-xl shadow-lg shadow-primary/20"
          >
            Book Now
          </Button>
        </SheetTrigger>
        
        {/* The Popup Content */}
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 overflow-y-auto">
             <SheetTitle className="sr-only">Book Tour</SheetTitle>
             
             <div className="p-4 pt-8 pb-20">
                 {/* Reusing the exact same Booking Widget */}
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