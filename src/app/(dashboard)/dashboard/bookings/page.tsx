import { cookies } from "next/headers";
import { BookingService } from "@/modules/bookings/booking.service";
import { verifyToken } from "@/lib/jwt";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import BookingsList from "@/components/bookings/BookingList";

// Define the Type manually or import from Prisma/Client
interface Booking {
  id: string;
  bookingDate: Date;
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
    profileImage: string | null;
  };
  guide: {
    name: string;
  };
}

export default async function BookingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  // ✅ FIX: Explicitly define the type array
  let bookings: Booking[] = []; 
  let userRole = "";

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded) {
        userRole = decoded.role;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await BookingService.getAllBookings(decoded.id, decoded.role);
        
        // Map Prisma result to our Interface (Handle Date/Nulls safely)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bookings = result.map((b: any) => ({
          ...b,
          // Ensure status matches the union type
          status: b.status as Booking["status"], 
          // Ensure tourist profileImage is handled
          tourist: {
            ...b.tourist,
            profileImage: b.tourist.profileImage || null
          }
        }));
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {userRole === "GUIDE" ? "Booking Requests" : "My Trips"}
        </h2>
        <p className="text-muted-foreground">
          {userRole === "GUIDE" 
            ? "Manage incoming booking requests and approvals." 
            : "View your upcoming adventures and payment status."}
        </p>
      </div>

      <Suspense fallback={<div className="flex h-[50vh] justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>}>
         {/* Convert Date objects to string for Client Component if needed, or pass as is if compatible */}
         {/* JSON.parse(JSON.stringify(bookings)) is a hack to serialize Dates for Client Components */}
         <BookingsList initialBookings={JSON.parse(JSON.stringify(bookings))} userRole={userRole} />
      </Suspense>
    </div>
  );
}