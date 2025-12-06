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
  CheckCircle, XCircle, CreditCard, Calendar, MapPin, Trash2, User, ChevronRight 
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Payment Callback
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success("Payment successful! Trip confirmed.");
      router.replace("/dashboard/bookings");
    } else if (status === "failed") {
      toast.error("Payment failed.");
      router.replace("/dashboard/bookings");
    }
  }, [searchParams, router]);

  // Handlers (Status & Payment)
  const handleStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem("accessToken");
    const toastId = toast.loading("Updating...");
    try {
      const res = await fetch(`/api/v1/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Updated to ${newStatus}`, { id: toastId });
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
      } else throw new Error("Failed");
    } catch { toast.error("Failed", { id: toastId }); }
  };

  const handlePayment = async (bookingId: string) => {
    const toastId = toast.loading("Redirecting...");
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
    } catch { toast.error("Payment failed", { id: toastId }); }
  };

  // Badge Helper
  const getStatusBadge = (status: string) => {
    const styles: any = {
      CONFIRMED: "bg-green-100 text-green-700 border-green-200",
      ACCEPTED: "bg-blue-100 text-blue-700 border-blue-200",
      PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
      CANCELLED: "bg-red-50 text-red-700 border-red-200",
      REJECTED: "bg-slate-100 text-slate-500 border-slate-200",
    };
    return <Badge variant="outline" className={`${styles[status]} font-semibold text-[10px] md:text-xs`}>{status}</Badge>;
  };

  // Action Buttons Helper
  const renderActions = (booking: Booking) => (
    <div className="flex justify-end gap-2">
      {userRole === "GUIDE" && booking.status === "PENDING" && (
         <>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600 rounded-full border-green-200 hover:bg-green-50" onClick={() => handleStatus(booking.id, "ACCEPTED")}><CheckCircle className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 rounded-full border-red-200 hover:bg-red-50" onClick={() => handleStatus(booking.id, "REJECTED")}><XCircle className="h-4 w-4" /></Button>
         </>
      )}
      {userRole === "TOURIST" && (
         <>
            {booking.status === "ACCEPTED" && (
               <Button size="sm" className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handlePayment(booking.id)}>Pay Now</Button>
            )}
            {booking.status === "PENDING" && (
               <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 rounded-full hover:bg-red-50" onClick={() => handleStatus(booking.id, "CANCELLED")}><Trash2 className="h-4 w-4" /></Button>
            )}
         </>
      )}
      {!["PENDING", "ACCEPTED"].includes(booking.status) && <span className="text-xs text-slate-400 italic">Done</span>}
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* 1. DESKTOP VIEW (Table) - Hidden on Mobile */}
      <Card className="hidden md:block shadow-sm border-slate-200">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Manage trips and requests</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="pl-6">Tour</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 bg-slate-200 rounded overflow-hidden relative">
                         <Image src={booking.listing.images?.[0] || "/placeholder.jpg"} alt="img" fill className="object-cover" />
                      </div>
                      <div className="space-y-0.5">
                         <p className="font-medium text-sm text-slate-900 line-clamp-1 w-32">{booking.listing.title}</p>
                         <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3"/> {booking.listing.city}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       {userRole === "GUIDE" && <Avatar className="h-6 w-6"><AvatarImage src={booking.tourist.profileImage}/><AvatarFallback>U</AvatarFallback></Avatar>}
                       <span className="text-sm font-medium">{userRole === "GUIDE" ? booking.tourist.name : booking.guide.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{format(new Date(booking.bookingDate), "MMM dd")}</TableCell>
                  <TableCell className="font-bold text-slate-900">৳{booking.totalAmount}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right pr-6">{renderActions(booking)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 2. MOBILE VIEW (Cards) - Hidden on Desktop */}
      <div className="md:hidden space-y-4">
         {bookings.map((booking) => (
            <Card key={booking.id} className="shadow-sm border-slate-200 overflow-hidden">
               <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div className="h-20 w-20 bg-slate-200 rounded-lg overflow-hidden relative shrink-0">
                     <Image src={booking.listing.images?.[0] || "/placeholder.jpg"} alt="img" fill className="object-cover" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{booking.listing.title}</h4>
                        <span className="text-xs font-bold text-primary">৳{booking.totalAmount}</span>
                     </div>
                     <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <Calendar className="h-3 w-3" /> {format(new Date(booking.bookingDate), "PPP")}
                     </p>
                     
                     <div className="flex justify-between items-center mt-2">
                        {getStatusBadge(booking.status)}
                        <div className="scale-90 origin-right">{renderActions(booking)}</div>
                     </div>
                  </div>
               </div>
            </Card>
         ))}
      </div>

    </div>
  );
}