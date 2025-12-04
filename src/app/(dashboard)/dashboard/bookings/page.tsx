"use client";

import { useEffect, useState, Suspense } from "react";
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
import { Button } from "@/components/ui/button";
import { Check, X, CreditCard, Loader2, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

// Booking Interface
interface Booking {
  id: string;
  bookingDate: string;
  numberOfPeople: number;
  totalAmount: number;
  // ✅ Added ACCEPTED to match new professional flow
  status: "PENDING" | "ACCEPTED" | "CONFIRMED" | "CANCELLED" | "REJECTED" | "COMPLETED";
  listing: {
    title: string;
    city: string;
  };
  tourist: {
    name: string;
    email: string;
  };
  guide: {
    name: string;
  };
}

// Main Content Component
function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Check Payment Status from URL (Callback)
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success("Payment successful! Your trip is confirmed.");
      router.replace("/dashboard/bookings");
      // Optional: Trigger a refetch here to update UI immediately
      setTimeout(() => window.location.reload(), 1000); 
    } else if (status === "failed") {
      toast.error("Payment failed or cancelled.");
      router.replace("/dashboard/bookings");
    }
  }, [searchParams, router]);

  // 2. Fetch Bookings & User Role
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Decode JWT for Role
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (e) {
        console.error("Token error", e);
      }

      const res = await fetch("/api/v1/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 3. Handle Status Update
  const handleStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem("accessToken");
    const toastId = toast.loading("Updating status...");

    try {
      const res = await fetch(`/api/v1/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Booking ${newStatus.toLowerCase()}`, { id: toastId });
        fetchBookings(); // Refresh list
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  // 4. Handle SSLCommerz Payment
  const handlePayment = async (bookingId: string) => {
    const toastId = toast.loading("Connecting to payment gateway...");
    
    try {
      const token = localStorage.getItem("accessToken");
      
      // Call Init API
      const res = await fetch("/api/v1/payments/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();

      if (data.success && data.data.url) {
        toast.success("Redirecting...", { id: toastId });
        window.location.href = data.data.url;
      } else {
        throw new Error(data.message || "Failed to initiate payment");
      }
    } catch (error: any) {
      toast.error(error.message || "Payment initiation failed", { id: toastId });
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED": return <Badge className="bg-green-600 hover:bg-green-700">Trip Confirmed</Badge>;
      case "ACCEPTED": return <Badge className="bg-blue-500 hover:bg-blue-600">Awaiting Payment</Badge>;
      case "PENDING": return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending Approval</Badge>;
      case "CANCELLED": return <Badge variant="destructive">Cancelled</Badge>;
      case "REJECTED": return <Badge variant="destructive">Rejected</Badge>;
      case "COMPLETED": return <Badge variant="secondary" className="bg-slate-200 text-slate-700">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {userRole === "GUIDE" ? "Booking Requests" : "My Trips"}
        </h2>
        <p className="text-muted-foreground">
          {userRole === "GUIDE" 
            ? "Manage incoming requests. Accept them to allow tourists to pay." 
            : "View your trip status. Pay for approved trips to confirm."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings List ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tour Details</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.listing.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {userRole === "GUIDE" 
                          ? `Tourist: ${booking.tourist.name}` 
                          : `Guide: ${booking.guide?.name}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{booking.numberOfPeople}</TableCell>
                    <TableCell className="font-bold">৳{booking.totalAmount}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        
                        {/* ===================================================
                            GUIDE ACTIONS 
                            1. Pending -> Accept (To ACCEPTED) / Reject
                        =================================================== */}
                        {userRole === "GUIDE" && booking.status === "PENDING" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                              onClick={() => handleStatus(booking.id, "ACCEPTED")}
                            >
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => handleStatus(booking.id, "REJECTED")}
                            >
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        
                        {/* Guide View for Awaiting Payment */}
                        {userRole === "GUIDE" && booking.status === "ACCEPTED" && (
                            <span className="text-xs text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" /> Waiting for payment
                            </span>
                        )}

                        {/* ===================================================
                            TOURIST ACTIONS
                            1. Pending -> Can Cancel
                            2. Accepted -> Can Pay
                        =================================================== */}
                        {userRole === "TOURIST" && (
                          <>
                            {/* Wait Message for Pending */}
                            {booking.status === "PENDING" && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-orange-500 font-medium">Waiting for approval</span>
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        className="text-red-500 hover:text-red-600 h-8 px-2"
                                        onClick={() => handleStatus(booking.id, "CANCELLED")}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}

                            {/* Pay Now Button (Only if ACCEPTED by Guide) */}
                            {booking.status === "ACCEPTED" && (
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white shadow-md animate-pulse"
                                onClick={() => handlePayment(booking.id)}
                              >
                                <CreditCard className="h-4 w-4 mr-2" /> Pay Now
                              </Button>
                            )}
                          </>
                        )}

                      </div>
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

// Main Page Component wrapped in Suspense (Required for useSearchParams)
export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <BookingsContent />
    </Suspense>
  );
}