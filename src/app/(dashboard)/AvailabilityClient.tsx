"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save, CalendarDays, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider"; // Language Hook

interface Listing {
  id: string;
  title: string;
  unavailableDates: string[];
}

export default function AvailabilityClient({ listings }: { listings: Listing[] }) {
  const { lang } = useLanguage(); // Language
  const [selectedListingId, setSelectedListingId] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);
  const [saving, setSaving] = useState(false);

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
    const toastId = toast.loading("Updating availability...");

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
        toast.success("Updated successfully!", { id: toastId });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          {lang === 'en' ? 'Availability Manager' : 'উপলব্ধতা ম্যানেজার'}
        </h2>
        <p className="text-muted-foreground mt-1">
          {lang === 'en' 
            ? "Block dates when you are unable to host tours. Tourists won't be able to book these dates." 
            : "যে তারিখগুলোতে আপনি ট্যুর করাতে পারবেন না, সেগুলো ব্লক করে রাখুন।"}
        </p>
      </div>

      {listings.length === 0 ? (
        <Card className="border-dashed border-2 bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-12 w-12 text-slate-400 mb-4 opacity-50" />
                <p className="text-lg font-medium text-slate-900">No Listings Found</p>
                <p className="text-slate-500 mb-6 max-w-sm">
                   You need to create a tour listing before managing availability.
                </p>
                <Button onClick={() => window.location.href = '/dashboard/listings/create'}>
                   Create Listing
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Controls */}
            <Card className="lg:col-span-1 h-fit shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle className="text-lg">Select Tour</CardTitle>
                    <CardDescription>Choose a tour to manage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Select value={selectedListingId} onValueChange={handleListingChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a tour" />
                        </SelectTrigger>
                        <SelectContent>
                            {listings.map((listing) => (
                                <SelectItem key={listing.id} value={listing.id}>
                                    {listing.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                        <p className="font-semibold flex items-center gap-2 mb-2">
                            <CalendarDays className="h-4 w-4" /> Instructions:
                        </p>
                        <ul className="list-disc list-inside space-y-1.5 text-xs opacity-90 pl-1">
                            <li>Click a date to <strong>block</strong> it.</li>
                            <li>Click again to <strong>unblock</strong>.</li>
                            <li>Blocked dates are disabled for booking.</li>
                        </ul>
                    </div>

                    <Button 
                        onClick={handleSave} 
                        className="w-full shadow-lg shadow-primary/20" 
                        disabled={saving || !selectedListingId}
                        size="lg"
                    >
                        {saving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Right: Calendar */}
            <Card className="lg:col-span-2 shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                    <CardDescription>
                        {selectedDates?.length 
                            ? `${selectedDates.length} dates currently blocked` 
                            : "No dates blocked yet"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center p-6">
                    <div className="border rounded-xl p-4 shadow-sm bg-white">
                      <Calendar
                          mode="multiple"
                          selected={selectedDates}
                          onSelect={setSelectedDates}
                          className="rounded-md"
                          disabled={(date) => date < new Date()}
                          modifiers={{ blocked: selectedDates || [] }}
                          modifiersStyles={{
                              blocked: { 
                                 backgroundColor: '#ef4444', 
                                 color: 'white', 
                                 borderRadius: '4px',
                                 fontWeight: 'bold'
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