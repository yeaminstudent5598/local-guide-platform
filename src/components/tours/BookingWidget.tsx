"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, DollarSign, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// ✅ 1. Interface Updated to match Parent Component Props
interface BookingWidgetProps {
  listingId: string;
  price: number;
  maxGroupSize: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blockedDates?: any[]; 
}

export default function BookingWidget({ 
  listingId, 
  price, 
  maxGroupSize, 
  blockedDates = [] 
}: BookingWidgetProps) {
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookingDate: "",
    numberOfPeople: 1,
    message: "",
  });

  // ✅ 2. Use 'price' prop for calculation
  const totalAmount = price * formData.numberOfPeople;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login to book");
      router.push("/login");
      return;
    }

    if (!formData.bookingDate) {
      toast.error("Please select a date");
      return;
    }

    // Optional: Check if date is blocked (Simple check)
    if (blockedDates.includes(formData.bookingDate)) {
        toast.error("This date is unavailable. Please choose another.");
        return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: listingId, // ✅ Use listingId from props
          // guideId removed from payload as it's not in props. 
          // Backend should infer guideId from listingId, or Parent needs to pass it.
          bookingDate: formData.bookingDate,
          numberOfPeople: formData.numberOfPeople,
          totalAmount,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Booking request sent!");
        router.push("/dashboard/bookings");
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-xl border-2 border-slate-100">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-blue-50 border-b">
          <CardTitle className="flex items-center justify-between">
            <span>Book This Tour</span>
            <div className="text-right">
              <div className="text-sm text-slate-500 font-normal">From</div>
              <div className="text-2xl font-bold text-primary">
                ৳{price} {/* ✅ Updated to use 'price' */}
              </div>
              <div className="text-xs text-slate-500 font-normal">per person</div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Select Date
              </Label>
              <Input
                id="date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                required
                className="text-lg"
              />
              {/* Optional: Show unavailable dates hint */}
              {blockedDates.length > 0 && (
                  <p className="text-xs text-red-400">Some dates may be unavailable by guide</p>
              )}
            </div>

            {/* Number of People */}
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Number of Travelers
              </Label>
              <Input
                id="guests"
                type="number"
                min={1}
                max={maxGroupSize} // ✅ Use maxGroupSize from props
                value={formData.numberOfPeople}
                onChange={(e) => setFormData({ ...formData, numberOfPeople: parseInt(e.target.value) })}
                required
                className="text-lg"
              />
              <p className="text-xs text-slate-500">
                Max {maxGroupSize} people per tour
              </p>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Special Requests (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Any specific requirements or questions?"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {/* Price Breakdown */}
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>৳{price} × {formData.numberOfPeople} person(s)</span>
                <span>৳{totalAmount}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">৳{totalAmount}</span>
              </div>
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-5 w-5" />
                    Request to Book
                  </>
                )}
              </Button>
            </motion.div>

            {/* Security Note */}
            <div className="flex items-start gap-2 text-xs text-slate-500 bg-green-50 p-3 rounded-lg">
              <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>
                Your payment is secure. You won't be charged until the guide confirms your booking.
              </p>
            </div>

          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}