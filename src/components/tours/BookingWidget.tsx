"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, DollarSign, Loader2, Shield, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface BookingWidgetProps {
  listingId: string;
  price: number;
  maxGroupSize: number;
  blockedDates?: any[]; 
}

export default function BookingWidget({ listingId, price, maxGroupSize, blockedDates = [] }: BookingWidgetProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ bookingDate: "", numberOfPeople: 1, message: "" });

  const totalAmount = price * formData.numberOfPeople;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) return router.push("/login");
    if (!formData.bookingDate) return toast.error("Select a journey date");

    setLoading(true);
    try {
      const res = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId, ...formData, totalAmount }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Expedition Request Sent!");
        router.push("/dashboard/bookings");
      } else throw new Error(data.message);
    } catch (error: any) {
      toast.error(error.message || "Request Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
        <div className="bg-slate-950 p-8 text-white relative overflow-hidden">
           <Sparkles className="absolute -right-2 top-0 h-24 w-24 text-emerald-500/10" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-2">Expedition Booking</p>
           <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">৳{price.toLocaleString()}</span>
              <span className="text-slate-400 text-sm font-medium">/ explorer</span>
           </div>
        </div>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-emerald-500" /> Start Date
              </Label>
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                className="h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-emerald-500 font-bold text-slate-700"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-emerald-500" /> Party Size
              </Label>
              <Input
                type="number"
                min={1} max={maxGroupSize}
                value={formData.numberOfPeople}
                onChange={(e) => setFormData({ ...formData, numberOfPeople: parseInt(e.target.value) })}
                className="h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-emerald-500 font-bold"
              />
              <p className="text-[9px] font-bold text-slate-400 uppercase text-center tracking-widest">Max capacity: {maxGroupSize} explorers</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] space-y-3 border border-slate-100">
               <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Package Price</span>
                  <span className="text-slate-900">৳{totalAmount.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Service Fee</span>
                  <span className="text-emerald-600">৳0 (Free)</span>
               </div>
               <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-sm font-black uppercase text-slate-900">Total</span>
                  <span className="text-xl font-black text-emerald-600">৳{totalAmount.toLocaleString()}</span>
               </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.8rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg border-none shadow-xl shadow-emerald-900/20 group">
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <>Request Reservation <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>

            <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <Shield className="h-3 w-3 text-emerald-500" /> No charge until confirmed
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}