"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save, CalendarDays, AlertCircle } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  unavailableDates: string[]; // API returns strings
}

export default function AvailabilityPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch Guide's Listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // Fetch listings for the logged-in guide
        // Note: You might need to adjust the API to filter by guideId if not already doing so based on token
        const res = await fetch("/api/v1/listings", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
          // Filter listings that belong to the guide (if API returns all)
          // Or assume API returns only guide's listings if role is guide
          // For safety, let's assume data.data contains the listings
          setListings(data.data);
          
          // Auto-select first listing if available
          if (data.data.length > 0) {
            const first = data.data[0];
            setSelectedListingId(first.id);
            setSelectedDates(
                first.unavailableDates.map((d: string) => new Date(d))
            );
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // 2. Handle Listing Selection Change
  const handleListingChange = (id: string) => {
    setSelectedListingId(id);
    const listing = listings.find((l) => l.id === id);
    if (listing) {
      setSelectedDates(listing.unavailableDates.map((d) => new Date(d)));
    }
  };

  // 3. Save Changes
  const handleSave = async () => {
    if (!selectedListingId) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/v1/listings/${selectedListingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          unavailableDates: selectedDates,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Availability updated successfully!");
        // Update local state
        const updatedListings = listings.map((l) => 
            l.id === selectedListingId ? { ...l, unavailableDates: result.data.unavailableDates } : l
        );
        setListings(updatedListings);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Availability Manager</h2>
        <p className="text-muted-foreground">
          Block dates when you are unable to host tours. Tourists won't be able to book these dates.
        </p>
      </div>

      {listings.length === 0 ? (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="h-10 w-10 text-slate-400 mb-4" />
                <p className="text-lg font-medium text-slate-900">No Listings Found</p>
                <p className="text-slate-500 mb-4">You need to create a tour listing before managing availability.</p>
                <Button onClick={() => window.location.href = '/dashboard/listings/create'}>Create Listing</Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left: Controls */}
            <Card className="md:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle className="text-lg">Select Tour</CardTitle>
                    <CardDescription>Choose a tour to manage dates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select value={selectedListingId} onValueChange={handleListingChange}>
                        <SelectTrigger>
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

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <p className="font-semibold flex items-center gap-2 mb-1">
                            <CalendarDays className="h-4 w-4" /> How to use:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs opacity-90">
                            <li>Select a date to <strong>block</strong> it.</li>
                            <li>Select it again to <strong>unblock</strong>.</li>
                            <li>Blocked dates are disabled for tourists.</li>
                        </ul>
                    </div>

                    <Button 
                        onClick={handleSave} 
                        className="w-full" 
                        disabled={saving || !selectedListingId}
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
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                    <CardDescription>
                        {selectedDates?.length 
                            ? `${selectedDates.length} dates blocked` 
                            : "No dates blocked"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={setSelectedDates}
                        className="rounded-md border shadow-sm p-4"
                        disabled={(date) => date < new Date()} // Disable past dates
                        modifiers={{
                             blocked: selectedDates || []
                        }}
                        modifiersStyles={{
                            blocked: { backgroundColor: 'var(--destructive)', color: 'white' }
                        }}
                    />
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}