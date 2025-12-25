"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CalendarDays, MapPin, User, Search, Filter, Loader2, Sparkles, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface Booking {
  id: string;
  bookingDate: string;
  numberOfPeople: number;
  totalAmount: number;
  status: string;
  listing: { title: string; city: string };
  tourist: { name: string; email: string };
  guide: { name: string; email: string };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("/api/v1/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (data.success) {
          setBookings(data.data);
        } else {
          toast.error("Failed to load bookings");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // --- 🎨 Premium Status Badges ---
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-200",
      PENDING: "bg-amber-100 text-amber-700 border-amber-200",
      CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
      REJECTED: "bg-slate-100 text-slate-700 border-slate-200",
      COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
      <Badge variant="outline" className={cn("px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-tighter", styles[status] || "bg-slate-50")}>
        {status}
      </Badge>
    );
  };

  // --- 🦴 Requirement 10: Skeleton Table Loader ---
  if (loading) return <BookingsTableSkeleton />;

  return (
    <div className="flex-1 space-y-8 p-6 md:p-10 pt-6 max-w-7xl mx-auto bg-[#F8FAFB] min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
             <Sparkles className="h-3 w-3" /> Transaction Logs
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Manage <span className="text-emerald-600 italic font-serif">Bookings</span></h2>
          <p className="text-slate-500 text-sm font-medium italic">Monitor global activities and tour statuses.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Total Entries</p>
                    <p className="text-xl font-black text-slate-900 leading-none">{bookings.length}</p>
                </div>
            </div>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 p-8 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">Live Booking Register</CardTitle>
            <div className="flex gap-2">
                <Badge variant="secondary" className="bg-slate-50 text-slate-500 hover:bg-slate-100 border-none px-3 py-1 font-bold">
                    System Verified
                </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-50">
                <TableHead className="py-5 pl-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Tour Details</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tourist Info</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Guide Info</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Amount</TableHead>
                <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-24">
                    <div className="flex flex-col items-center gap-3 text-slate-300">
                        <Search className="h-12 w-12 opacity-20" />
                        <p className="font-bold text-sm">No bookings found in the registry.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                    {/* Tour Info */}
                    <TableCell className="py-6 pl-8">
                      <div className="font-bold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">{booking.listing.title}</div>
                      <div className="flex items-center text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                        <MapPin className="h-3 w-3 mr-1 text-emerald-500" />
                        {booking.listing.city}
                      </div>
                    </TableCell>

                    {/* Tourist Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                            {booking.tourist.name[0]}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-slate-900 text-xs">{booking.tourist.name}</span>
                           <span className="text-[10px] font-medium text-slate-400">{booking.tourist.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Guide Info */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                            <UserCheck className="h-3 w-3 text-blue-500" /> {booking.guide?.name}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">{booking.guide?.email}</span>
                      </div>
                    </TableCell>

                    {/* Booking Date & Amount */}
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-black text-slate-900 text-sm">৳{booking.totalAmount}</div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                            <CalendarDays className="h-3 w-3" />
                            {new Date(booking.bookingDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="pr-8 text-right">
                      {getStatusBadge(booking.status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// --- 🦴 Requirement 10: Skeleton Component ---
function BookingsTableSkeleton() {
  return (
    <div className="p-10 space-y-10 animate-pulse bg-slate-50 min-h-screen max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded-lg" />
            <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-20 w-40 bg-white rounded-2xl shadow-sm" />
      </div>
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="h-20 bg-white border-b border-slate-50" />
        <div className="p-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between p-8 border-b border-slate-50 bg-white">
              <div className="space-y-2"><div className="h-4 w-40 bg-slate-100 rounded" /><div className="h-3 w-20 bg-slate-50 rounded" /></div>
              <div className="h-8 w-32 bg-slate-50 rounded-lg" />
              <div className="h-8 w-32 bg-slate-50 rounded-lg" />
              <div className="h-4 w-20 bg-slate-100 rounded" />
              <div className="h-8 w-24 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}