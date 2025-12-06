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
  CheckCircle, XCircle, CreditCard, Calendar, MapPin, Trash2, User 
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/providers/LanguageProvider"; // ✅ Added Language Hook

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
  const { lang } = useLanguage(); // ✅ Language Context
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Translations
  const t = {
    title: lang === 'en' ? "All Bookings" : "সকল বুকিং",
    desc: lang === 'en' ? "Manage your trips and booking requests." : "আপনার ভ্রমণ এবং বুকিং রিকোয়েস্ট ম্যানেজ করুন।",
    noBookings: lang === 'en' ? "No bookings found." : "কোনো বুকিং পাওয়া যায়নি।",
    headers: {
      tour: lang === 'en' ? "Tour Info" : "ট্যুর তথ্য",
      user: lang === 'en' ? "User" : "ব্যবহারকারী",
      date: lang === 'en' ? "Date" : "তারিখ",
      guests: lang === 'en' ? "Guests" : "অতিথি",
      total: lang === 'en' ? "Total" : "মোট",
      status: lang === 'en' ? "Status" : "অবস্থা",
      action: lang === 'en' ? "Actions" : "অ্যাকশন",
    },
    role: {
      tourist: lang === 'en' ? "Tourist" : "ট্যুরিস্ট",
      guide: lang === 'en' ? "Guide" : "গাইড",
    },
    actions: {
      accept: lang === 'en' ? "Accept" : "গ্রহণ করুন",
      reject: lang === 'en' ? "Reject" : "বাতিল করুন",
      pay: lang === 'en' ? "Pay Now" : "পেমেন্ট করুন",
      cancel: lang === 'en' ? "Cancel" : "ক্যান্সেল",
      done: lang === 'en' ? "Done" : "সম্পন্ন",
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

  // Payment Callback
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success(lang === 'en' ? "Payment successful! Trip confirmed." : "পেমেন্ট সফল! ট্রিপ নিশ্চিত হয়েছে।");
      router.replace("/dashboard/bookings");
    } else if (status === "failed") {
      toast.error(lang === 'en' ? "Payment failed." : "পেমেন্ট ব্যর্থ হয়েছে।");
      router.replace("/dashboard/bookings");
    }
  }, [searchParams, router, lang]);

  // Handlers
  const handleStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem("accessToken");
    const toastId = toast.loading(lang === 'en' ? "Updating..." : "আপডেট হচ্ছে...");
    try {
      const res = await fetch(`/api/v1/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(lang === 'en' ? "Updated successfully" : "সফলভাবে আপডেট হয়েছে", { id: toastId });
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
      } else throw new Error("Failed");
    } catch { toast.error(lang === 'en' ? "Update failed" : "আপডেট ব্যর্থ হয়েছে", { id: toastId }); }
  };

  const handlePayment = async (bookingId: string) => {
    const toastId = toast.loading(lang === 'en' ? "Redirecting..." : "রিডাইরেক্ট হচ্ছে...");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/v1/payments/init", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (data.success) window.location.href = data.data.url;
      else throw new Error("Init failed");
    } catch { toast.error(lang === 'en' ? "Payment failed" : "পেমেন্ট ব্যর্থ হয়েছে", { id: toastId }); }
  };

  // Badge Helper (Localized)
  const getStatusBadge = (status: string) => {
    const styles: any = {
      CONFIRMED: "bg-green-100 text-green-700 border-green-200",
      ACCEPTED: "bg-blue-100 text-blue-700 border-blue-200",
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
      REJECTED: "bg-slate-100 text-slate-500 border-slate-200",
      COMPLETED: "bg-purple-100 text-purple-700 border-purple-200",
    };
    // @ts-ignore - dynamic key access
    const label = t.status[status] || status;
    
    return <Badge variant="outline" className={`${styles[status]} font-semibold text-[10px] md:text-xs whitespace-nowrap`}>{label}</Badge>;
  };

  // Actions Helper
  const renderActions = (booking: Booking, isMobile = false) => {
    const actions = [];

    if (userRole === "GUIDE" && booking.status === "PENDING") {
      actions.push(
        <Button key="accept" size="sm" onClick={() => handleStatus(booking.id, "ACCEPTED")} className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs">{t.actions.accept}</Button>,
        <Button key="reject" size="sm" variant="outline" onClick={() => handleStatus(booking.id, "REJECTED")} className="text-red-600 border-red-200 hover:bg-red-50 h-8 text-xs">{t.actions.reject}</Button>
      );
    }
    if (userRole === "TOURIST") {
      if (booking.status === "ACCEPTED") {
        actions.push(
           <Button key="pay" size="sm" onClick={() => handlePayment(booking.id)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 text-xs">{t.actions.pay}</Button>
        );
      }
      if (booking.status === "PENDING") {
        actions.push(
           <Button key="cancel" size="sm" variant="ghost" onClick={() => handleStatus(booking.id, "CANCELLED")} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2 text-xs">{t.actions.cancel}</Button>
        );
      }
    }

    if (actions.length === 0) return <span className="text-xs text-slate-400 italic">{t.actions.done}</span>;
    return <div className={`flex gap-2 ${isMobile ? 'justify-between w-full mt-4 border-t pt-3' : 'justify-end'}`}>{actions}</div>;
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      
      {/* --- 1. DESKTOP TABLE VIEW (Image Removed) --- */}
      <Card className="hidden md:block shadow-sm border-slate-200">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.desc}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
             <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="pl-6">{t.headers.tour}</TableHead>
                    <TableHead>{t.headers.user}</TableHead>
                    <TableHead>{t.headers.date}</TableHead>
                    <TableHead>{t.headers.guests}</TableHead>
                    <TableHead>{t.headers.total}</TableHead>
                    <TableHead>{t.headers.status}</TableHead>
                    <TableHead className="text-right pr-6">{t.headers.action}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        {t.noBookings}
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-slate-50/30">
                        <TableCell className="pl-6 py-4">
                           <div>
                              <p className="font-semibold text-slate-900 text-sm">{booking.listing.title}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                 <MapPin className="h-3 w-3"/> {booking.listing.city}
                              </p>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              {userRole === "GUIDE" && <Avatar className="h-6 w-6"><AvatarImage src={booking.tourist.profileImage}/><AvatarFallback className="text-[10px]">U</AvatarFallback></Avatar>}
                              <div className="flex flex-col">
                                 <span className="text-sm font-medium">{userRole === "GUIDE" ? booking.tourist.name : booking.guide.name}</span>
                                 <span className="text-[10px] text-slate-400 uppercase">{userRole === "GUIDE" ? t.role.tourist : t.role.guide}</span>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                           {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell><span className="text-sm text-slate-600">{booking.numberOfPeople}</span></TableCell>
                        <TableCell><span className="font-bold text-slate-900">৳{booking.totalAmount}</span></TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right pr-6">{renderActions(booking)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
             </Table>
          </div>
        </CardContent>
      </Card>

      {/* --- 2. MOBILE CARD VIEW (Image Removed) --- */}
      <div className="md:hidden space-y-3">
         {bookings.length === 0 ? (
            <div className="text-center py-10 text-slate-500 border-2 border-dashed rounded-lg">{t.noBookings}</div>
         ) : (
            bookings.map((booking) => (
               <Card key={booking.id} className="shadow-sm border-slate-200">
                  <CardContent className="p-4">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{booking.listing.title}</h4>
                           <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {format(new Date(booking.bookingDate), "PPP")}
                           </p>
                        </div>
                        {getStatusBadge(booking.status)}
                     </div>
                     
                     <div className="flex justify-between items-center text-sm mt-4 bg-slate-50 p-2 rounded-md">
                        <div>
                           <span className="text-xs text-slate-400 block">{t.headers.user}</span>
                           <span className="font-medium text-slate-700">{userRole === "GUIDE" ? booking.tourist.name : booking.guide.name}</span>
                        </div>
                        <div className="text-right">
                           <span className="text-xs text-slate-400 block">{t.headers.total}</span>
                           <span className="font-bold text-slate-900">৳{booking.totalAmount}</span>
                        </div>
                     </div>

                     {renderActions(booking, true)}
                  </CardContent>
               </Card>
            ))
         )}
      </div>

    </div>
  );
}