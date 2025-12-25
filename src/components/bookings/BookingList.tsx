"use client";

import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, XCircle, CreditCard, Calendar, MapPin, Trash2, User, Sparkles, Loader2, History
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

// Interfaces
interface Booking {
  id: string;
  bookingDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: "PENDING" | "ACCEPTED" | "CONFIRMED" | "CANCELLED" | "REJECTED" | "COMPLETED";
  listing: {
    title: string;
    city: string;
    images: string[];
  };
  tourist: {
    name: string;
    email: string;
    profileImage?: string;
  };
  guide: {
    name: string;
  };
}

interface BookingsListProps {
  initialBookings: Booking[];
  userRole: string;
}

export default function BookingsList({ initialBookings, userRole }: BookingsListProps) {
  const { lang } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(true); 
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800); 
    return () => clearTimeout(timer);
  }, []);

  // Translations Object (Fix: added 'role' property)
  const t = {
    title: lang === 'en' ? "Journey History" : "ভ্রমণ ইতিহাস",
    desc: lang === 'en' ? "Manage your upcoming trips and verified bookings." : "আপনার আসন্ন ভ্রমণ এবং যাচাইকৃত বুকিং পরিচালনা করুন।",
    noBookings: lang === 'en' ? "No records found in registry." : "খাতায় কোনো বুকিং পাওয়া যায়নি।",
    role: { // ✅ এই অংশটি মিসিং ছিল যা এরর তৈরি করছিল
      tourist: lang === 'en' ? "Tourist" : "ট্যুরিস্ট",
      guide: lang === 'en' ? "Local Guide" : "লোকাল গাইড",
    },
    headers: {
      tour: lang === 'en' ? "Tour Identity" : "ট্যুর তথ্য",
      user: lang === 'en' ? "Partner" : "পার্টনার",
      date: lang === 'en' ? "Schedule" : "সময়সূচী",
      total: lang === 'en' ? "Pricing" : "মূল্য",
      status: lang === 'en' ? "Status" : "অবস্থা",
      action: lang === 'en' ? "Control" : "নিয়ন্ত্রণ",
    },
    actions: {
      accept: lang === 'en' ? "Confirm" : "নিশ্চিত",
      reject: lang === 'en' ? "Decline" : "বাতিল",
      pay: lang === 'en' ? "Secure Pay" : "পেমেন্ট",
      cancel: lang === 'en' ? "Abort" : "বন্ধ",
      done: lang === 'en' ? "Archived" : "আর্কাইভ",
    },
    status: {
      CONFIRMED: lang === 'en' ? "Confirmed" : "নিশ্চিত",
      ACCEPTED: lang === 'en' ? "Accepted" : "গৃহীত",
      PENDING: lang === 'en' ? "Pending" : "অপেক্ষমান",
      CANCELLED: lang === 'en' ? "Cancelled" : "বাতিল",
      REJECTED: lang === 'en' ? "Rejected" : "প্রত্যাখ্যাত",
      COMPLETED: lang === 'en' ? "Completed" : "সম্পন্ন",
    }
  };

  // Payment Callback Logic
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success(lang === 'en' ? "Payment verified! Journey unlocked." : "পেমেন্ট যাচাইকৃত! ভ্রমণ আনলক হয়েছে।");
      router.replace("/dashboard/bookings");
    }
  }, [searchParams, router, lang]);

  const handleStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem("accessToken");
    const toastId = toast.loading(lang === 'en' ? "Syncing status..." : "সিঙ্ক হচ্ছে...");
    try {
      const res = await fetch(`/api/v1/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success("Registry updated", { id: toastId });
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
      }
    } catch { toast.error("Sync failed", { id: toastId }); }
  };

  const handlePayment = async (bookingId: string) => {
    const toastId = toast.loading("Initiating secure gateway...");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/v1/payments/init", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (data.success) window.location.href = data.data.url;
    } catch { toast.error("Gateway error", { id: toastId }); }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-200",
      ACCEPTED: "bg-blue-100 text-blue-700 border-blue-200",
      PENDING: "bg-amber-100 text-amber-700 border-amber-200",
      CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
      REJECTED: "bg-slate-100 text-slate-500 border-slate-200",
      COMPLETED: "bg-purple-100 text-purple-700 border-purple-200",
    };
    // @ts-ignore
    const label = t.status[status as keyof typeof t.status] || status;
    return <Badge variant="outline" className={cn("font-black text-[9px] uppercase tracking-tighter px-3 py-1 rounded-full shadow-sm", styles[status])}>{label}</Badge>;
  };

  const renderActions = (booking: Booking, isMobile = false) => {
    const actions = [];
    if (userRole === "GUIDE" && booking.status === "PENDING") {
      actions.push(
        <Button key="accept" size="sm" onClick={() => handleStatus(booking.id, "ACCEPTED")} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-9 px-4 font-bold shadow-lg shadow-emerald-900/10 border-none">{t.actions.accept}</Button>,
        <Button key="reject" size="sm" variant="outline" onClick={() => handleStatus(booking.id, "REJECTED")} className="text-rose-500 border-rose-100 hover:bg-rose-50 rounded-xl h-9 px-4 font-bold">{t.actions.reject}</Button>
      );
    }
    if (userRole === "TOURIST") {
      if (booking.status === "ACCEPTED") {
        actions.push(<Button key="pay" size="sm" onClick={() => handlePayment(booking.id)} className="bg-slate-900 hover:bg-emerald-600 text-white rounded-xl h-10 px-6 font-bold shadow-xl border-none group"> {t.actions.pay} <CreditCard className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" /> </Button>);
      }
      if (booking.status === "PENDING") {
        actions.push(<Button key="cancel" size="sm" variant="ghost" onClick={() => handleStatus(booking.id, "CANCELLED")} className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 font-bold px-4">{t.actions.cancel}</Button>);
      }
    }
    if (actions.length === 0) return <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t.actions.done}</span>;
    return <div className={cn("flex gap-3", isMobile ? 'justify-between w-full mt-5 pt-4 border-t' : 'justify-end')}>{actions}</div>;
  };

  if (loading) return <BookingsSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 bg-[#F8FAFB] min-h-screen p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
               <History className="h-3 w-3" /> Audit Logs
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">{t.title}</h2>
          <p className="text-sm font-medium text-slate-500 italic mt-1">{t.desc}</p>
        </div>
        <Badge variant="outline" className="bg-white border-slate-100 px-4 py-2 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-slate-400">
           Verified Records: {bookings.length}
        </Badge>
      </div>

      {/* Desktop View */}
      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50">
                <TableHead className="pl-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.tour}</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.user}</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.date}</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.total}</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.status}</TableHead>
                <TableHead className="text-right pr-10 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.headers.action}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-64 text-center font-bold text-slate-300 italic">{t.noBookings}</TableCell></TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id} className="group hover:bg-slate-50/50 transition-all border-slate-50">
                    <TableCell className="pl-10 py-6">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{booking.listing.title}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                           <MapPin className="h-3 w-3 text-emerald-500"/> {booking.listing.city}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                             <AvatarImage src={booking.tourist.profileImage}/>
                             <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">{booking.tourist.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                             <span className="text-xs font-black text-slate-900">{userRole === "GUIDE" ? booking.tourist.name : booking.guide.name}</span>
                             <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{userRole === "GUIDE" ? t.role.tourist : t.role.guide}</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-400 whitespace-nowrap">
                       {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell><span className="font-black text-slate-900">৳{booking.totalAmount}</span></TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right pr-10">{renderActions(booking)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile View */}
      <div className="md:hidden space-y-5 pb-10">
         {bookings.map((booking) => (
            <Card key={booking.id} className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
               <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                     <div className="space-y-1 max-w-[70%]">
                        <h4 className="font-black text-sm text-slate-900 line-clamp-1">{booking.listing.title}</h4>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                           <Calendar className="h-3.5 w-3.5 text-emerald-500" /> {format(new Date(booking.bookingDate), "PPP")}
                        </div>
                     </div>
                     {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex justify-between items-center text-xs mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                     <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">{t.headers.user}</span>
                        <span className="font-bold text-slate-700">{userRole === "GUIDE" ? booking.tourist.name : booking.guide.name}</span>
                     </div>
                     <div className="text-right space-y-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">{t.headers.total}</span>
                        <span className="font-black text-slate-900 text-lg">৳{booking.totalAmount}</span>
                     </div>
                  </div>
                  {renderActions(booking, true)}
               </CardContent>
            </Card>
         ))}
      </div>
    </div>
  );
}

// --- 🦴 Skeleton Loader Component ---
function BookingsSkeleton() {
  return (
    <div className="p-10 space-y-10 animate-pulse bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end border-b border-slate-100 pb-8">
        <div className="space-y-3"><div className="h-10 w-64 bg-slate-200 rounded-xl" /><div className="h-4 w-40 bg-slate-200 rounded-lg" /></div>
        <div className="h-12 w-40 bg-white rounded-2xl shadow-sm" />
      </div>
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
        <div className="h-20 bg-slate-50" />
        <div className="space-y-0">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between p-10 border-b border-slate-50">
              <div className="h-4 w-48 bg-slate-100 rounded" />
              <div className="flex gap-3"><div className="h-10 w-10 rounded-full bg-slate-100" /><div className="h-4 w-24 bg-slate-100 rounded" /></div>
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-6 w-24 bg-slate-100 rounded-full" />
              <div className="h-10 w-32 bg-slate-900/5 rounded-xl" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}