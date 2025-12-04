"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CalendarDays, MapPin, User } from "lucide-react";

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
        // Admin সব বুকিং পাবে (Backend এ লজিক করা আছে)
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

  // Helper function to colorize status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED": return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
      case "PENDING": return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case "CANCELLED": return <Badge variant="destructive">Cancelled</Badge>;
      case "REJECTED": return <Badge variant="destructive">Rejected</Badge>;
      case "COMPLETED": return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-muted-foreground">Loading all bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">All Bookings</h2>
          <p className="text-muted-foreground">Monitor all transactions and booking statuses.</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-1">
          Total: {bookings.length}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tour Details</TableHead>
                <TableHead>Tourist Info</TableHead>
                <TableHead>Guide Info</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No bookings found in the system.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    {/* Tour Info */}
                    <TableCell>
                      <div className="font-medium">{booking.listing.title}</div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {booking.listing.city}
                      </div>
                    </TableCell>

                    {/* Tourist Info */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm flex items-center gap-1">
                          <User className="h-3 w-3" /> {booking.tourist.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{booking.tourist.email}</span>
                      </div>
                    </TableCell>

                    {/* Guide Info */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{booking.guide?.name}</span>
                        <span className="text-xs text-muted-foreground">{booking.guide?.email}</span>
                      </div>
                    </TableCell>

                    {/* Booking Date */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="font-bold text-slate-700">
                      ৳ {booking.totalAmount}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
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