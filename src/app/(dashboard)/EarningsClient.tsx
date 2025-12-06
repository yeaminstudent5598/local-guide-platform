"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Download, CreditCard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/LanguageProvider"; 

interface EarningItem {
  id: string;
  amount: number;
  transactionId: string;
  createdAt: string; 
  booking: {
    bookingDate: string;
    tourist: { name: string; email: string };
    listing: { title: string };
  };
}

interface EarningsProps {
  history: EarningItem[];
  totalEarnings: number;
  pendingPayout: number;
}

export default function EarningsClient({ history, totalEarnings, pendingPayout }: EarningsProps) {
  const { lang } = useLanguage();

  return (
    <div className="space-y-8 p-2 md:p-4">
      
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            {lang === 'en' ? 'Earnings & Payouts' : 'উপার্জন এবং পেমেন্ট'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === 'en' ? 'Track your revenue streams.' : 'আপনার আয়ের হিসাব দেখুন।'}
          </p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto gap-2 border-slate-300">
          <Download className="h-4 w-4" /> 
          {lang === 'en' ? 'Export CSV' : 'CSV ডাউনলোড'}
        </Button>
      </div>

      {/* --- Stats Cards (Responsive Grid) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Total Revenue */}
        <Card className="bg-green-50 border-green-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-green-700">৳ {totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-green-600/80 mt-1 flex items-center font-medium">
              <TrendingUp className="h-3 w-3 mr-1" /> Lifetime earnings
            </p>
          </CardContent>
        </Card>

        {/* Pending Payout */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-slate-800">৳ {pendingPayout.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for withdrawal</p>
          </CardContent>
        </Card>

        {/* Transactions Count */}
        <Card className="shadow-sm border-slate-200 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Transactions</CardTitle>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-slate-800">{history.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Transaction History Title --- */}
      <h3 className="text-xl font-bold text-slate-900 pt-4">Transaction History</h3>

      {history.length === 0 ? (
        <Card className="border-dashed border-2 bg-slate-50/50">
           <CardContent className="py-16 text-center text-muted-foreground">
              No transactions found yet.
           </CardContent>
        </Card>
      ) : (
        <>
          {/* ✅ 1. DESKTOP VIEW (Table) - Hidden on Mobile */}
          <div className="hidden md:block rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="pl-6">Date</TableHead>
                  <TableHead>Tour Name</TableHead>
                  <TableHead>Tourist Info</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-6 text-slate-500 font-medium text-sm">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {item.booking.listing.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{item.booking.tourist.name}</span>
                        <span className="text-xs text-slate-400">{item.booking.tourist.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {item.transactionId}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-700 text-base">
                      ৳ {item.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 px-3 py-0.5">
                        Paid
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ✅ 2. MOBILE VIEW (Cards) - Visible only on Mobile */}
          <div className="md:hidden space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="shadow-sm border-slate-200">
                <CardContent className="p-4 space-y-4">
                   
                   {/* Top Row: Date & Status */}
                   <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-slate-500 gap-1">
                         <Calendar className="h-3 w-3" />
                         {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 text-[10px] px-2 py-0">
                        Paid
                      </Badge>
                   </div>

                   {/* Middle: Tour & User */}
                   <div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.booking.listing.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="bg-slate-100 p-1 rounded-full"><User className="h-3 w-3 text-slate-500" /></div>
                         <span className="text-xs text-slate-600">{item.booking.tourist.name}</span>
                      </div>
                   </div>

                   {/* Bottom: ID & Amount */}
                   <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                         #{item.transactionId}
                      </span>
                      <span className="font-bold text-lg text-slate-900">
                         ৳ {item.amount.toLocaleString()}
                      </span>
                   </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}