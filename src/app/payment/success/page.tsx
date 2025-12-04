"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle, Map, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tranId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-green-500">
        <CardHeader className="flex flex-col items-center text-center space-y-4 pt-12">
          {/* Animated Check Icon */}
          <div className="rounded-full bg-green-100 p-4 animate-bounce-slow">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your booking. Your payment has been processed successfully.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Transaction Details Box */}
          <div className="bg-slate-100 p-4 rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-mono font-medium text-slate-700">{tranId || "TXN-123456"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded text-xs">PAID</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium text-slate-700">SSLCommerz</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            A confirmation email has been sent to your inbox.
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pb-8">
          <Link href="/dashboard/bookings" className="w-full">
            <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200">
              Go to My Trips <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading receipt...</div>}>
      <SuccessContent />
    </Suspense>
  );
}