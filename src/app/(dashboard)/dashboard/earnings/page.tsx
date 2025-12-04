"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EarningItem {
  id: string;
  amount: number;
  currency: string;
  transactionId: string;
  createdAt: string;
  booking: {
    bookingDate: string;
    tourist: { name: string; email: string };
    listing: { title: string };
  };
}

export default function EarningsPage() {
  const [history, setHistory] = useState<EarningItem[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingPayout, setPendingPayout] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await fetch("/api/v1/earnings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setHistory(data.data.history);
          setTotalEarnings(data.data.total);
          setPendingPayout(data.data.pending);
        } else {
          toast.error("Failed to load earnings data");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Calculating revenue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Earnings & Payouts</h2>
          <p className="text-muted-foreground">Track your revenue streams and transaction history.</p>
        </div>
        <Button variant="outline" className="hidden md:flex gap-2">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-green-50 border-green-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">৳ {totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-green-600/80 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Payout</CardTitle>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">৳ {pendingPayout.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for withdrawal</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Transactions</CardTitle>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{history.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Transaction Table --- */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Tour Name</TableHead>
                <TableHead>Tourist Info</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No transactions found yet. Your earnings will appear here once bookings are paid.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-muted-foreground font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.booking.listing.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.booking.tourist.name}</span>
                        <span className="text-xs text-muted-foreground">{item.booking.tourist.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {item.transactionId}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-700">
                      ৳ {item.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                        Paid
                      </Badge>
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