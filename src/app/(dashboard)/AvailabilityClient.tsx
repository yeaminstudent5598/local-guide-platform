"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save, CalendarDays, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  unavailableDates: string[];
}

export default function AvailabilityClient({ listings }: { listings: Listing[] }) {
  const { lang } = useLanguage();
  const [selectedListingId, setSelectedListingId] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Loading State for Requirement 10

  // --- 🔄 Simulation for Skeleton Loader [Requirement 10] ---
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-select first listing
  useEffect(() => {
    if (listings.length > 0 && !selectedListingId) {
      const first = listings[0];
      setSelectedListingId(first.id);
      setSelectedDates(first.unavailableDates.map((d) => new Date(d)));
    }
  }, [listings, selectedListingId]);

  // Handle Selection
  const handleListingChange = (id: string) => {
    setSelectedListingId(id);
    const listing = listings.find((l) => l.id === id);
    if (listing) {
      setSelectedDates(listing.unavailableDates.map((d) => new Date(d)));
    }
  };

  // Save Changes
  const handleSave = async () => {
    if (!selectedListingId) return;
    setSaving(true);
    const toastId = toast.loading("Syncing availability records...");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/v1/listings/${selectedListingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ unavailableDates: selectedDates }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Availability synced successfully!", { id: toastId });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // ✅ Show Skeleton Loader while loading [Requirement 10]
  if (loading) return <AvailabilitySkeleton />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-8 bg-[#F8FAFB] min-h-screen animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="border-b border-slate-100 pb-8">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
             <Sparkles className="h-3 w-3" /> Schedule Management
        </div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900">
          {lang === 'en' ? 'Availability Manager' : 'উপলব্ধতা ম্যানেজার'}
        </h2>
        <p className="text-sm font-medium text-slate-500 italic mt-2 max-w-2xl">
          {lang === 'en' 
            ? "Curate your hosting schedule by blocking dates. This ensures a seamless booking experience for your tourists." 
            : "যে তারিখগুলোতে আপনি ট্যুর করাতে পারবেন না, সেগুলো ব্লক করে রাখুন যাতে পর্যটকরা কোনো ভুল বুকিং না করতে পারে।"}
        </p>
      </div>

      {listings.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-white/50 rounded-[2.5rem]">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                   <AlertCircle className="h-10 w-10 text-slate-200" />
                </div>
                <p className="text-xl font-bold text-slate-900 mb-2">No Active Listings</p>
                <p className="text-slate-500 mb-8 max-w-xs font-medium italic">
                   Initiate your first tour listing to begin managing your professional schedule.
                </p>
                <Button className="h-12 px-8 rounded-xl bg-slate-950 hover:bg-emerald-600 transition-all shadow-xl" onClick={() => window.location.href = '/dashboard/listings/create'}>
                   Create New Listing
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Controls Card */}
            <Card className="lg:col-span-1 h-fit border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-8">
                    <CardTitle className="text-xl font-bold text-slate-900">Configure Tour</CardTitle>
                    <CardDescription className="text-xs font-medium italic">Select a listing to audit availability.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label>
                        <Select value={selectedListingId} onValueChange={handleListingChange}>
                            <SelectTrigger className="h-14 rounded-2xl border-none bg-slate-50 font-bold text-slate-900 focus:ring-emerald-500 shadow-inner">
                                <SelectValue placeholder="Select a tour" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                                {listings.map((listing) => (
                                    <SelectItem key={listing.id} value={listing.id} className="font-medium">
                                        {listing.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 text-sm">
                        <p className="font-black text-emerald-700 flex items-center gap-2 mb-3 uppercase text-[10px] tracking-widest">
                            <CalendarDays className="h-3.5 w-3.5" /> Protocol:
                        </p>
                        <ul className="space-y-2.5 text-[11px] font-bold text-emerald-600/80 leading-relaxed">
                            <li className="flex gap-2"><span>•</span> Click on any date to <strong>Blacklist</strong> it from the booking pool.</li>
                            <li className="flex gap-2"><span>•</span> Re-click to <strong>Whitelist</strong> and restore availability.</li>
                            <li className="flex gap-2"><span>•</span> All blocked dates are immediately synced with public listings.</li>
                        </ul>
                    </div>

                    <Button 
                        onClick={handleSave} 
                        className="w-full h-16 rounded-[1.8rem] bg-slate-950 hover:bg-emerald-600 text-white font-black text-lg transition-all shadow-xl shadow-slate-200 border-none group"
                        disabled={saving || !selectedListingId}
                    >
                        {saving ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Syncing...</>
                        ) : (
                            <><CheckCircle2 className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Save Changes</>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Right: Interactive Calendar */}
            <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-xl font-bold">Interactive Scheduler</CardTitle>
                    <CardDescription className="text-xs font-medium italic">
                        {selectedDates?.length 
                            ? `${selectedDates.length} premium dates currently restricted` 
                            : "No dates restricted yet. Your calendar is wide open."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-10">
                    <div className="border border-slate-100 rounded-[2rem] p-6 shadow-inner bg-slate-50/30">
                      <Calendar
                          mode="multiple"
                          selected={selectedDates}
                          onSelect={setSelectedDates}
                          className="rounded-md"
                          disabled={(date) => date < new Date()}
                          modifiers={{ blocked: selectedDates || [] }}
                          modifiersStyles={{
                              blocked: { 
                                  backgroundColor: '#10b981', 
                                  color: 'white', 
                                  borderRadius: '8px',
                                  fontWeight: '900',
                                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                              }
                          }}
                      />
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}

// --- 🦴 Requirement 10: Skeleton Component ---
function AvailabilitySkeleton() {
  return (
    <div className="p-10 space-y-12 animate-pulse bg-slate-50 min-h-screen max-w-7xl mx-auto">
      <div className="space-y-4 border-b border-slate-100 pb-8">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        <div className="h-4 w-full max-w-md bg-slate-200 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-[550px] bg-white rounded-[2.5rem] shadow-sm" />
        <div className="lg:col-span-2 h-[550px] bg-white rounded-[2.5rem] shadow-sm" />
      </div>
    </div>
  );
}