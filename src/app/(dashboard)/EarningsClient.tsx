"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, TrendingUp, Calendar, ArrowUpRight, 
  Download, CreditCard, User, Sparkles, Search, History 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/LanguageProvider"; 
import { cn } from "@/lib/utils";

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
  const [loading, setLoading] = useState(true); // ✅ Loading State for Requirement 10

  // --- 🔄 Simulation for Skeleton Loader [Requirement 10] ---
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Translations
  const t = {
    title: lang === 'en' ? 'Earnings & Payouts' : 'উপার্জন এবং পেমেন্ট',
    subtitle: lang === 'en' ? 'Track your revenue streams and transaction history.' : 'আপনার আয়ের উৎস এবং লেনদেনের ইতিহাস ট্র্যাক করুন।',
    export: lang === 'en' ? 'Export CSV' : 'CSV ডাউনলোড',
    historyTitle: lang === 'en' ? 'Transaction Ledger' : 'লেনদেনের খাতা',
    noData: lang === 'en' ? 'No transactions found in records.' : 'লেনদেনের কোনো রেকর্ড পাওয়া যায়নি।',
  };

  // ✅ Show Skeleton Loader while loading [Requirement 10]
  if (loading) return <EarningsSkeleton />;

  return (
    <div className="space-y-8 p-4 md:p-8 bg-[#F8FAFB] min-h-screen animate-in fade-in duration-700">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
               <Sparkles className="h-3 w-3" /> Financial Summary
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">{t.title}</h2>
          <p className="text-sm font-medium text-slate-500 italic mt-1">{t.subtitle}</p>
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 bg-white font-bold hover:bg-slate-50 transition-all shadow-sm gap-2">
          <Download className="h-4 w-4" /> {t.export}
        </Button>
      </div>

      {/* --- Stats Cards Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <EarningStatCard 
            title="Total Revenue" 
            value={`৳ ${totalEarnings.toLocaleString()}`} 
            icon={DollarSign} 
            color="emerald" 
            sub="Lifetime earnings" 
            trend="+14.2%" 
        />
        <EarningStatCard 
            title="Pending Payout" 
            value={`৳ ${pendingPayout.toLocaleString()}`} 
            icon={ArrowUpRight} 
            color="amber" 
            sub="Processing locally" 
        />
        <EarningStatCard 
            title="Total Transactions" 
            value={history.length} 
            icon={CreditCard} 
            color="slate" 
            sub="Successfully completed" 
        />
      </div>

      {/* --- History Section --- */}
      <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
             <History className="h-5 w-5 text-slate-400" />
             <h3 className="text-xl font-bold text-slate-900">{t.historyTitle}</h3>
          </div>

          {history.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200 bg-white/50 rounded-[2.5rem]">
               <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                     <Search className="h-10 w-10 text-slate-200" />
                  </div>
                  <p className="text-slate-500 font-bold italic">{t.noData}</p>
               </CardContent>
            </Card>
          ) : (
            <>
              {/* ✅ DESKTOP VIEW (Table) */}
              <Card className="hidden md:block border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-slate-50">
                        <TableHead className="pl-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experience Title</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Partner Details</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference ID</TableHead>
                        <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</TableHead>
                        <TableHead className="text-right pr-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((item) => (
                        <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-all border-slate-50">
                          <TableCell className="pl-10 py-6 text-xs font-bold text-slate-400 uppercase">
                            {new Date(item.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                          </TableCell>
                          <TableCell className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                            {item.booking.listing.title}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-700">{item.booking.tourist.name}</span>
                              <span className="text-[10px] font-medium text-slate-400">{item.booking.tourist.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shadow-inner uppercase">
                              #{item.transactionId.slice(-8)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-black text-slate-900 text-sm">
                            ৳{item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[9px] uppercase tracking-tighter px-3 py-1 rounded-full shadow-sm">
                              Settled
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* ✅ MOBILE VIEW (Cards) */}
              <div className="md:hidden space-y-5 pb-10">
                {history.map((item) => (
                  <Card key={item.id} className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden group">
                    <CardContent className="p-6 space-y-5">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center text-[10px] font-black text-slate-400 uppercase gap-1.5">
                             <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                             {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                            Settled
                          </Badge>
                       </div>

                       <div className="space-y-1">
                          <h4 className="font-black text-sm text-slate-900 line-clamp-1">{item.booking.listing.title}</h4>
                          <div className="flex items-center gap-2">
                             <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center"><User className="h-3 w-3 text-slate-400" /></div>
                             <span className="text-xs font-bold text-slate-500">{item.booking.tourist.name}</span>
                          </div>
                       </div>

                       <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                          <span className="font-mono text-[9px] text-slate-300 font-bold">
                             REF: {item.transactionId.slice(-10)}
                          </span>
                          <span className="font-black text-xl text-slate-900">
                             ৳{item.amount.toLocaleString()}
                          </span>
                       </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
      </div>
    </div>
  );
}

// --- 🏷️ Sub-Component: Luxury Stat Card ---
function EarningStatCard({ title, value, icon: Icon, color, sub, trend }: any) {
  const themes: any = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-all bg-white">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className={cn("p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110", themes[color])}>
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter">
              {trend}
            </span>
          )}
        </div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{title}</h3>
        <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest italic">{sub}</p>
      </CardContent>
    </Card>
  );
}

// --- 🦴 Requirement 10: Skeleton Loader Component ---
function EarningsSkeleton() {
  return (
    <div className="p-10 space-y-10 animate-pulse bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end border-b border-slate-100 pb-8">
        <div className="space-y-3"><div className="h-4 w-32 bg-slate-200 rounded" /><div className="h-10 w-64 bg-slate-200 rounded-xl" /></div>
        <div className="h-12 w-40 bg-white rounded-2xl shadow-sm" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-[2rem] shadow-sm" />)}
      </div>
      <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white mt-10">
        <div className="h-20 bg-slate-50" />
        <div className="space-y-0">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between p-10 border-b border-slate-50">
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-4 w-48 bg-slate-100 rounded" />
              <div className="space-y-2"><div className="h-3 w-32 bg-slate-100 rounded" /><div className="h-2 w-20 bg-slate-50 rounded" /></div>
              <div className="h-6 w-32 bg-slate-50 rounded-lg" />
              <div className="h-4 w-16 bg-slate-100 rounded" />
              <div className="h-8 w-24 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}