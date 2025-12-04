"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { XCircle, RefreshCcw, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-red-500">
        <CardHeader className="flex flex-col items-center text-center space-y-4 pt-12">
          {/* Animated X Icon */}
          <div className="rounded-full bg-red-100 p-4 animate-in zoom-in duration-300">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">Payment Failed!</h1>
            <p className="text-muted-foreground">
              We couldn&apos;t process your payment. Don&apos;t worry, you haven&apos;t been charged.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-800 text-center">
            <p>Possible reasons:</p>
            <ul className="list-disc list-inside text-red-600/80 mt-1 space-y-1 text-xs">
              <li>Insufficient funds</li>
              <li>Transaction cancelled by user</li>
              <li>Network issues</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pb-8">
          <Link href="/dashboard/bookings" className="w-full">
            <Button className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200">
              <RefreshCcw className="w-5 h-5 mr-2" /> Try Again
            </Button>
          </Link>
          
          <div className="flex gap-3 w-full">
            <Link href="/" className="w-1/2">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" /> Home
              </Button>
            </Link>
            <Link href="/contact" className="w-1/2">
              <Button variant="outline" className="w-full">
                <HelpCircle className="w-4 h-4 mr-2" /> Support
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}